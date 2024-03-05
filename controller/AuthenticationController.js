import {
    User
} from '../models/User.js';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import crypto from "crypto";

let emailFrom = `Kasi.eCo <${process.env.KASIECO_EMAIL}>`;

function jwtSignUser(user) {
    const ONE_WEEK = 60 * 60 * 24 * 7;
    return jwt.sign(user, config.authentication.jwtSecret, {
        expiresIn: ONE_WEEK
    });
}

export default {
    async register(req, res) {
        try {
            req.body.userType = "Customer";
            if (req.body.userType == "Customer") {
                req.body.variant = "warning";
                req.body.priority = 2;
                req.body.CompanyId = 1;
            } else if (req.body.userType == "Admin") {
                req.body.variant = "dark";
                req.body.priority = 1;
                req.body.CompanyId = 1;
            }

            let buf = crypto.randomInt(100000, 999999);
            let token = buf.toString();
            req.body.registerToken = token;
            req.body.profileImage = "../static/imgs/default-man (1).png";

            const user = await User.create(req.body);

            let transporter = await nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: process.env.KASIECO_EMAIL,
                    pass: process.env.KASIECO_PASSWORD,
                },
                tls: {
                    rejectUnauthorized: false
                }
            });

            let mailOptions = {
                from: emailFrom,
                to: req.body.email,
                subject: "Email verification code to register",
                text: `Hi ${user.firstName} ${user.lastName},\n\nWelcome to Kasi.eCo!\n\nYour email verification code is: ${token}\n\nUse this code to complete the registration process.\n\nEnjoy using your emarket account!\n`
            };

            await transporter.sendMail(mailOptions);

            return res.send({
                id: user.id
            });
        } catch (err) {
            return res.status(400).send({
                error: 'This account is already in use.'
            });
        }
    },
    async login(req, res) {
        try {
            const {
                email,
                password
            } = req.body
            const user = await User.findOne({
                where: {
                    email: email
                }
            })
            if (!user) {
                return res.status(403).send({
                    error: 'Incorrect login information.'
                })
            }
            if (user.registerToken) {
                let transporter = await nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.KASIECO_EMAIL,
                        pass: process.env.KASIECO_PASSWORD,
                    },
                    tls: {
                        rejectUnauthorized: false
                    }
                })
                let mailOptions = {
                    from: emailFrom,
                    to: req.body.email,
                    subject: "Email verification code to login",
                    text: 'hello ' + user.firstName + ' ' + user.lastName + ',\n\n' + 'Recently you\'ve requested to create an account on emarket\n\n' +
                        'Please verify your email address first\n\n' +
                        'click on the following link, or paste it into your browser to complete this process\n\n' +
                        'http://' + 'localhost:8080' + '/user-verify/' + token + '\n\n' +
                        'If you did not request this, please ignore this email.\n'
                }
                await transporter.sendMail(mailOptions, function (err) {
                    if (err) {
                        return res.status(403).send({
                            error: "An error occured when trying to send an email to login verification."
                        });
                    }
                });
                return res.status(403).send({
                    error: 'We need to verify your email first.<br>So, We sent you a verification link to do that.<br>Please follow the given instruction.'
                })
            }
            const correctPwd = password === user.pwd
            if (!correctPwd) {
                return res.status(403).send({
                    error: 'Incorrect login information.'
                })
            }
            const newUser = {
                id: user.id,
                username: user.userName,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                userType: user.userType,
                variant: user.variant,
                profileImage: user.profileImage,
                priority: user.priority,
                CompanyId: user.CompanyId
            }
            res.send({
                user: newUser,
                token: jwtSignUser(newUser)
            })
        } catch (err) {
            res.status(500).send({
                error: 'An error occured when trying to sign in.'
            })
        }
    },

    async verifyPassword(req, res) {
        try {
            const correctPwd = req.params.pwd === req.user.pwd
            if (!correctPwd) {
                return res.status(403).send({
                    error: 'incorrect current password.'
                })
            }
            res.send({
                correctPassword: correctPwd
            })
        } catch (error) {
            res.status(500).send({
                error: "An error occured when verifying the password"
            })
        }
    },
    async updatePassword(req, res) {
        try {
            const user = await User.update(req.body, {
                where: {
                    id: req.user.id
                }
            })
            res.send(user)
        } catch (err) {
            res.status(500).send({
                error: "An error occured when trying to update the password"
            })
        }
    },
    async requestPasswordToken(req, res) {
        try {
            let buf = crypto.randomBytes(20);
            let token = buf.toString('hex');
            const user = {
                email: req.body.email,
                resetPasswordToken: token
            };
            await User.update(user, {
                where: {
                    email: user.email
                }
            })
            let transporter = await nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.KASIECO_EMAIL,
                    pass: process.env.KASIECO_PASSWORD,
                },
                tls: {
                    rejectUnauthorized: false
                }
            })
            let mailOptions = {
                from: emailFrom,
                to: req.body.email,
                subject: "Reset Password Confirmation",
                text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                    'http://' + 'localhost:8080' + '/reset-password/' + token + '\n\n' +
                    'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            }
            await transporter.sendMail(mailOptions, function (err) {
                if (err) {
                    return res.status(403).send({
                        error: "An error occured when trying to send an email for request password token"
                    });
                }
            });
            res.send(token);
        } catch (err) {
            res.status(500).send({
                error: 'An error occured when trying to request password token.'
            })
        }
    },
    async verifyPasswordToken(req, res) {
        try {
            const user = await User.findOne({
                where: {
                    resetPasswordToken: req.params.token
                },
                attributes: [
                    "id",
                    "username",
                    "firstName",
                    "lastName",
                    "profileImage",
                    "email",
                    "userType",
                    "variant",
                    "priority",
                    "CompanyId"
                ]
            });
            if (!user) {
                return res.status(403).send({
                    error: "invalid token."
                })
            }
            res.send(user)
        } catch (err) {
            return res.status(500).send({
                error: "An error occured when verifying the password reset token."
            })
        }
    },
    async checkRegsToken(req, res) {
        try {
            const user = await User.findOne({
                where: {
                    email: req.body.email
                },
                attributes: ["id", "firstName", "lastName", "registerToken"]
            });
            if (!user) {
                return res.sendStatus(404).status({
                    error: "Invalid email address."
                })
            }
            let retUser = {
                id: user.id,
                verificationStatus: true
            }
            if (user.registerToken) {
                retUser.verificationStatus = false
                let transporter = await nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.KASIECO_EMAIL,
                        pass: process.env.KASIECO_PASSWORD,
                    },
                    tls: {
                        rejectUnauthorized: false
                    }
                })
                var mailOptions = {
                    from: emailFrom,
                    to: req.body.email,
                    subject: "Email Verification code to register",
                    text: 'Hi ' + user.firstName + ' ' + user.lastName + ',\n\n' +
                        'Welcome to Kasi.eCo!\n\n' +
                        'Your email verification code is: ' + user.registerToken + '\n\n' +
                        'Use this code to complete the registration process.\n\n' +
                        'Enjoy using you Kasi.eCo account!\n'
                }
                await transporter.sendMail(mailOptions, function (err) {
                    if (err) {
                        return res.status(403).send({
                            error: "An error occured when trying to send an email to register."
                        });
                    }
                });
            }

            res.send(retUser)
        } catch (err) {
            return res.status(500).send({
                error: "An error occured when trying to check users registration token."
            })
        }
    },
    async verifyRegsToken(req, res) {
        try {
            const user = await User.findByPk(req.body.userId, {
                attributes: [
                    "id",
                    "username",
                    "firstName",
                    "lastName",
                    "profileImage",
                    "email",
                    "userType",
                    "registerToken",
                    "variant",
                    "priority",
                    "CompanyId"
                ]
            });

            if (!user || user.registerToken != req.body.registerToken) {
                return res.status(403).send({
                    error: "invalid token id."
                })
            }
            const newUser = {
                id: user.id,
                username: user.userName,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                userType: user.userType,
                variant: user.variant,
                profileImage: user.profileImage,
                priority: user.priority,
                CompanyId: user.CompanyId
            }
            res.send({
                user: newUser,
                token: jwtSignUser(newUser)
            })
        } catch (err) {
            res.status(500).send({
                error: "An error occured when verifying the register token."
            })
        }
    },

    async resetPassword(req, res) {
        try {
            const user = {
                password: req.body.password,
                resetPasswordToken: ""
            }
            const userId = req.body.id
            await User.update(user, {
                where: {
                    id: userId
                }
            })
            let transporter = await nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMARKET_EMAIL,
                    pass: process.env.EMARKET_PASSWORD,
                },
                tls: {
                    rejectUnauthorized: false
                }
            })
            let mailOptions = {
                from: emailFrom,
                to: req.body.email,
                subject: "Password Update Acknowledgement",
                text: 'Hello ' + req.body.name + '\n\n' +
                    'We wanted to let you know that your Kasi.eCo password was reset.\n'
            }
            await transporter.sendMail(mailOptions, function (err) {
                if (err) {
                    return res.status(403).send({
                        error: "An error occured when trying to send email to reset password."
                    })
                }
            });
            res.send(userId)
        } catch (err) {
            res.status(500).send({
                error: "An error occured when trying to reset password."
            })
        }
    },
    async resetRegsToken(req, res) {
        try {
            const user = {
                registerToken: ""
            }
            const userId = req.body.id
            const userRet = await User.update(user, {
                where: {
                    id: userId
                }
            })
            let transporter = await nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.KASIECO_EMAIL,
                    pass: process.env.KASIECO_PASSWORD,
                },
                tls: {
                    rejectUnauthorized: false
                }
            })
            let mailOptions = {
                from: emailFrom,
                to: req.body.email,
                subject: "Email Address Verification Confirmed",
                text: "Hello " + req.body.name + ",\n\n" +
                    "Your email is now verified on Kasi.eCo.\n\n" +
                    "Thank you.\n"
            }
            await transporter.sendMail(mailOptions, function (err) {
                if (err) {
                    return res.status(403).send({
                        error: "An error occured when trying to send an email to reset register token"
                    });
                }
            });
            res.send(userRet)
        } catch (err) {
            res.status(500).send({
                error: "An error occured when trying to reset register token."
            })
        }
    }
};