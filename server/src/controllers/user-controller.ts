import { Request, Response, NextFunction } from 'express';
import User, { IUser } from '../models/user';
import { body, validationResult } from 'express-validator';
import passport from 'passport';
import bcrypt from 'bcryptjs';

exports.signup_post = [
  body('name', 'Enter your name.').trim().isLength({ min: 1 }).escape(),
  body('email', 'Enter a valid email.').trim().isLength({ min: 1 }).escape(),
  body('phone', 'Enter a valid phone number').trim().escape(),
  body('password', 'Password must be between 6 and 16 characters.')
    .isLength({ min: 6, max: 16 })
    .escape(),

  (req: Request<IUser>, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors });
    }
    bcrypt.hash(req.body.password, 10, (err: Error, hashedPassword: string) => {
      if (err) {
        return next(err);
      }
      const user = new User({
        name: req.body.name.charAt(0)
          ? req.body.name.charAt(0).toUpperCase() + req.body.name.slice(1)
          : '',
        email: req.body.email,
        phone: req.body.phone ? req.body.phone : '',
        password: hashedPassword,
        emailAlert: req.body.emailAlert,
        textAlert: req.body.textAlert,
        mountains: { Vail: 0, Keystone: 0, Breckenridge: 0 },
      });
      User.findOne({ email: user.email }).exec((err, results) => {
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
          return res
            .status(200)
            .json({ message: 'Account successfully created.', user });
        });
      });
    });
  },
];

exports.login_post = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('local', (err: Error, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ message: 'Incorrect email or password.' });
    }
    req.login(user, (err: Error) => {
      if (err) {
        return res.send(err);
      }
      return res.status(200).json({
        message: 'Logged in successfully.',
        user,
      });
    });
  })(req, res, next);
};

exports.logout_post = (req: Request, res: Response, next: NextFunction) => {
  req.logout((err: Error) => {
    if (err) {
      return next(err);
    }
    res.status(200).json({
      message: 'Logged out successfully.',
    });
  });
};

exports.user_get = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    User.findById(req.user._id).exec((err, results) => {
      if (err) {
        return next(err);
      }
      res.status(200).json(results);
    });
  } else {
    res.status(401).json({ message: 'Access denied. Not logged in.' });
  }
};

exports.user_put = [
  body('name', 'Enter your name.').trim().isLength({ min: 1 }).escape(),
  body('email', 'Enter a valid email.').trim().isLength({ min: 1 }).escape(),
  body('phone', 'Enter a valid phone number').trim().escape(),
  body('password', 'Password must be between 6 and 16 characters.')
    .isLength({ min: 6, max: 16 })
    .escape(),

  (req: Request<IUser>, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors });
    }
    passport.authenticate('local', (err: Error, user) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json({ message: 'Incorrect password.' });
      }
      bcrypt.hash(
        req.body.newPass ? req.body.newPass : req.body.password,
        10,
        (err: Error, hashedPassword: string) => {
          if (err) {
            return next(err);
          }
          const updatedUser = new User({
            _id: req.user?._id,
            name: req.body.name.charAt(0)
              ? req.body.name.charAt(0).toUpperCase() + req.body.name.slice(1)
              : '',
            email: req.body.newEmail ? req.body.newEmail : req.body.email,
            phone: req.body.phone ? req.body.phone : '',
            password: hashedPassword,
            emailAlert: req.body.emailAlert,
            textAlert: req.body.textAlert,
            mountains: req.body.mountains,
          });
          User.findByIdAndUpdate(req.user?._id, updatedUser, {}, (err) => {
            if (err) {
              return next(err);
            }
            return res
              .status(200)
              .json({ message: 'Account updated successfully.' });
          });
        }
      );
    })(req, res, next);
  },
];

exports.auth_get = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return res.status(200).json({ message: 'User authenticated.' });
  } else {
    return res.status(401).json({ message: 'Not authenticated.' });
  }
};
