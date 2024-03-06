import {
    Order
} from '../models/Order.js';
import nodemailer from 'nodemailer';

let emailFrom = `Kasi.eCo <${process.env.KASIECO_EMAIL}>`;

export default {
    async getOrderList(req, res) {
        try {
            const orderList = await Order.findAll({
                order: [
                    ['createdAt', 'DESC']
                ]
            });
            res.send(orderList);
        } catch (err) {
            res.status(500).send({
                error: 'An error occurred when trying to fetch order list.'
            });
        }
    },
    async getOrder(req, res) {
        try {
            const order = await Order.findByPk(req.params.orderId);
            res.send(order);
        } catch (err) {
            res.status(500).send({
                error: 'An error occurred when trying to fetch an order.'
            });
        }
    },
    async getOrderBySessionId(req, res) {
        try {
            const order = await Order.findOne({
                where: {
                    checkoutSessionId: req.params.sessionId
                }
            });
            res.send(order);
        } catch (err) {
            res.status(500).send({
                error: 'An error occurred when trying to fetch an order.'
            });
        }
    },
    async createOrder(req, res) {
        try {
            const order = await Order.create(req.body);
            let transporter = nodemailer.createTransport({
                service: 'gmail',
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
                to: order.email,
                subject: "Check Order Status",
                text: 'Hi ' + order.name + ',\n\n' +
                    'Thanks for your purchase!\n\n' +
                    'Please follow the link to keep track of your order.\n\n' +
                    'http://localhost:8080/order/' + order.checkoutSessionId + '\n\n' +
                    'Your session Id: ' + order.checkoutSessionId + '\n\n' +
                    'Thanks for using kasieco\n'
            };

            await transporter.sendMail(mailOptions);

            res.send(order);
        } catch (err) {
            res.status(500).send({
                error: 'An error occurred when trying to create an order.'
            });
        }
    },
    async updateOrder(req, res) {
        try {
            await Order.update(req.body, {
                where: {
                    id: req.body.id
                }
            });

            res.send(req.body);
        } catch (err) {
            res.status(500).send({
                error: 'An error occurred when trying to update an order.'
            });
        }
    },
    async deleteOrder(req, res) {
        try {
            const order = await Order.findByPk(req.params.orderId);

            if (!order) {
                return res.status(403).send({
                    error: 'No order to delete.'
                });
            }

            await order.destroy();

            res.send(order);
        } catch (err) {
            res.status(500).send({
                error: 'An error occurred when trying to delete an order.'
            });
        }
    },
};
