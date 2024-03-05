import passport from 'passport';
import {
    User
} from './models/User.js';

import {
    Strategy as JwtStrategy,
    ExtractJwt
} from 'passport-jwt';

passport.use(
    new JwtStrategy({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: config.authentication.jwtSecret
    }, async function (jwtPayload, done) {
        try {
            const user = await User.findOne({
                where: {
                    id: jwtPayload.id
                }
            });
            if (!user) {
                return done(new Error(), false);
            }
            return done(null, user);
        } catch (err) {
            return done(new Error(), false);
        }
    })
);

export default null;