"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("../models/user"));
const express_validator_1 = require("express-validator");
const passport_1 = __importDefault(require("passport"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const lodash_1 = __importDefault(require("lodash"));
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;
const client = require('twilio')(accountSid, authToken);
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: 'summitsnowalerts@gmail.com',
        pass: process.env.EMAIL_PASS,
    },
});
exports.signup_post = [
    (0, express_validator_1.body)('name', 'Enter your name.').trim().isLength({ min: 1 }).escape(),
    (0, express_validator_1.body)('email', 'Enter a valid email.').trim().isLength({ min: 1 }).escape(),
    (0, express_validator_1.body)('phone', 'Enter a valid phone number').trim().escape(),
    (0, express_validator_1.body)('password', 'Password must be between 6 and 16 characters.')
        .isLength({ min: 6, max: 16 })
        .escape(),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors });
        }
        bcryptjs_1.default.hash(req.body.password, 10, (err, hashedPassword) => {
            if (err) {
                return next(err);
            }
            const user = new user_1.default({
                name: req.body.name.charAt(0)
                    ? req.body.name.charAt(0).toUpperCase() + req.body.name.slice(1)
                    : '',
                email: req.body.email,
                phone: req.body.phone ? req.body.phone : '',
                password: hashedPassword,
                notifications: req.body.notifications,
                mountains: {},
            });
            user_1.default.findOne({ email: user.email }).exec((err, results) => {
                if (err) {
                    return next(err);
                }
                if (results !== null) {
                    user.password = req.body.password;
                    return res
                        .status(400)
                        .json({ message: 'That email is already taken.' });
                }
                user.save((err, user) => {
                    if (err) {
                        return next(err);
                    }
                    const body = 'You have successfully signed up for Summit Snow Alerts. Happy shredding! Visit summitsnowalerts.com to update your settings. Reply STOP to unsubscribe.';
                    if (user.notifications.text === true && user.phone.length > 0) {
                        client.messages.create({
                            body: body,
                            from: twilioNumber,
                            to: user.phone,
                        });
                    }
                    if (user.notifications.email === true) {
                        const mailOptions = {
                            from: 'summitsnowalerts@gmail.com',
                            to: user.email,
                            subject: 'Summit Snow Alerts: Confirmation',
                            text: body,
                        };
                        transporter.sendMail(mailOptions, (error) => {
                            if (error) {
                                console.error(error);
                            }
                        });
                    }
                    return res
                        .status(200)
                        .json({ message: 'Account successfully created.', user });
                });
            });
        });
    },
];
exports.login_post = (req, res, next) => {
    passport_1.default.authenticate('local', (err, user) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({ message: 'Incorrect email or password.' });
        }
        req.login(user, (err) => {
            if (err) {
                return res.send(err);
            }
            user.password = '';
            return res.status(200).json({
                message: 'Logged in successfully.',
                user,
            });
        });
    })(req, res, next);
};
exports.logout_post = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.status(200).json({
            message: 'Logged out successfully.',
        });
    });
};
exports.user_get = (req, res, next) => {
    if (req.isAuthenticated()) {
        user_1.default.findById(req.user._id).exec((err, results) => {
            if (err) {
                return next(err);
            }
            if (results)
                results.password = '';
            res.status(200).json(results);
        });
    }
    else {
        res.status(401).json({ message: 'Access denied. Not logged in.' });
    }
};
exports.user_put = [
    (0, express_validator_1.body)('name', 'Enter your name.').trim().isLength({ min: 1 }).escape(),
    (0, express_validator_1.body)('email', 'Enter a valid email.').trim().isLength({ min: 1 }).escape(),
    (0, express_validator_1.body)('phone', 'Enter a valid phone number').trim().escape(),
    (0, express_validator_1.body)('password', 'Password must be between 6 and 16 characters.')
        .isLength({ min: 6, max: 16 })
        .escape(),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors });
        }
        passport_1.default.authenticate('local', (err, user) => {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.status(401).json({ message: 'Incorrect password.' });
            }
            bcryptjs_1.default.hash(req.body.newPass ? req.body.newPass : req.body.password, 10, (err, hashedPassword) => {
                var _a, _b;
                if (err) {
                    return next(err);
                }
                const updatedUser = new user_1.default({
                    _id: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id,
                    name: req.body.name.charAt(0)
                        ? req.body.name.charAt(0).toUpperCase() + req.body.name.slice(1)
                        : '',
                    email: req.body.newEmail ? req.body.newEmail : req.body.email,
                    phone: req.body.phone ? req.body.phone : '',
                    password: hashedPassword,
                    notifications: req.body.notifications
                        ? req.body.notifications
                        : user.notifications,
                    mountains: req.body.mountains ? req.body.mountains : user.mountains,
                });
                user_1.default.findByIdAndUpdate((_b = req.user) === null || _b === void 0 ? void 0 : _b._id, updatedUser, {}, (err) => {
                    if (err) {
                        return next(err);
                    }
                    const formatString = (array) => {
                        let string = '';
                        if (array.length > 2) {
                            array[array.length - 1] = 'and ' + array[array.length - 1];
                            string = array.join(', ');
                        }
                        else if (array.length === 2) {
                            string = array.join(' and ');
                        }
                        else {
                            string = array.join('');
                        }
                        return string;
                    };
                    // Format alert preferences for message
                    let mountainsChanged = false;
                    if (!lodash_1.default.isEqual(user.mountains, updatedUser.mountains)) {
                        mountainsChanged = true;
                    }
                    let notificationsChanged = false;
                    if (!lodash_1.default.isEqual(user.notifications, updatedUser.notifications)) {
                        notificationsChanged = true;
                    }
                    let mountainNames = Object.keys(updatedUser.mountains);
                    let mountainString = formatString(mountainNames);
                    let times = [];
                    for (const key of Object.keys(updatedUser.notifications.times)) {
                        let time = key;
                        if (updatedUser.notifications.times[time])
                            times.push(`${time}:00`);
                    }
                    let timeString = formatString(times);
                    let days = [];
                    for (const key of Object.keys(updatedUser.notifications.days)) {
                        let day = key;
                        if (updatedUser.notifications.days[day])
                            days.push(day.charAt(0).toLocaleUpperCase() + day.slice(1));
                    }
                    let dayString;
                    days.length === 7
                        ? (dayString = 'Every day.')
                        : (dayString = formatString(days));
                    if (updatedUser.notifications.text &&
                        updatedUser.phone.length > 0 &&
                        (mountainsChanged || notificationsChanged)) {
                        client.messages.create({
                            body: `SSA - Settings updated.\n\nMountains: ${mountainString}.\n\nTimes: ${timeString}.\n\nDays: ${dayString}\n\nVisit summitsnowalerts.com to update your settings. Reply STOP to unsubscribe.`,
                            from: twilioNumber,
                            to: user.phone,
                        });
                    }
                    if (updatedUser.notifications.email &&
                        (mountainsChanged || notificationsChanged)) {
                        const mailOptions = {
                            from: 'summitsnowalerts@gmail.com',
                            to: user.email,
                            subject: 'Summit Snow Alerts: Settings Updated',
                            text: `SSA - Settings updated.\n\nMountains: ${mountainString}.\n\nTimes: ${timeString}.\n\nDays: ${dayString}\n\nVisit summitsnowalerts.com to update your settings. or unsubscribe.`,
                        };
                        transporter.sendMail(mailOptions, (error) => {
                            if (error) {
                                console.error(error);
                            }
                        });
                    }
                    return res
                        .status(200)
                        .json({ message: 'Account updated successfully.' });
                });
            });
        })(req, res, next);
    },
];
exports.auth_get = (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.status(200).json({ message: 'User authenticated.' });
    }
    else {
        return res.status(401).json({ message: 'Not authenticated.' });
    }
};
