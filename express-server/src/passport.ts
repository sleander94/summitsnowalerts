import passport from 'passport';
import bcrypt from 'bcryptjs';
const LocalStrategy = require('passport-local').Strategy;
import User, { IUser } from './models/user';

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    (email: string, password: string, done: Function) => {
      User.findOne({ email: email }, (err: Error, user: IUser) => {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        bcrypt.compare(password, user.password, (err: Error, res: boolean) => {
          if (res) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'Incorrect password.' });
          }
        });
      });
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((id, done) => {
  User.findById(id, function (err: Error, user: IUser) {
    done(err, user);
  });
});
