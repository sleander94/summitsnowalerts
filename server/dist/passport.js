"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const LocalStrategy = require('passport-local').Strategy;
const user_1 = __importDefault(require("./models/user"));
passport_1.default.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
}, (email, password, done) => {
    user_1.default.findOne({ email: email }, (err, user) => {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false, { message: 'Incorrect username.' });
        }
        bcryptjs_1.default.compare(password, user.password, (err, res) => {
            if (res) {
                return done(null, user);
            }
            else {
                return done(null, false, { message: 'Incorrect password.' });
            }
        });
    });
}));
passport_1.default.serializeUser((user, done) => {
    done(null, user._id);
});
passport_1.default.deserializeUser((id, done) => {
    user_1.default.findById(id, function (err, user) {
        done(err, user);
    });
});
