const passport = require('passport');
const bcrypt = require('bcryptjs');
const LocalStrategy = require('passport-local').Strategy;
import User from './models/user';

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    (email: any, password: any, done: any) => {
      User.findOne({ email: email }, (err: any, user: any) => {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        bcrypt.compare(password, user.password, (err: any, res: any) => {
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

passport.serializeUser(function (user: any, done: any) {
  done(null, user.id);
});

passport.deserializeUser(function (id: any, done: any) {
  User.findById(id, function (err: any, user: any) {
    done(err, user);
  });
});
