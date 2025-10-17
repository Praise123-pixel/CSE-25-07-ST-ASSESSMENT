const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/users'); // make sure this path and filename are correct

// --- GET LOGIN PAGE ---
router.get('/login', (req, res) => {
  res.render('login', { errors: {}, formData: {} });
});

// --- POST LOGIN ---
router.post('/login', [
  body('identifier')
    .notEmpty()
    .withMessage('Email or Phone is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('login', {
      errors: errors.mapped(),
      formData: req.body
    });
  }

  try {
    const { identifier, password } = req.body;
    const user = await User.findOne({ emailOrPhone: identifier });
    if (!user) {
      return res.render('login', { errors: { identifier: { msg: 'Invalid credentials' } }, formData: req.body });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.render('login', { errors: { password: { msg: 'Invalid credentials' } }, formData: req.body });
    }

    // Login success
    res.send(`Welcome, ${user.emailOrPhone}!`);
  } catch (err) {
    console.error(err);
    res.render('login', { errors: { general: { msg: 'Server error, try again' } }, formData: req.body });
  }
});

// --- GET SIGNUP PAGE ---
router.get('/signup', (req, res) => {
  res.render('signup', { errors: {}, formData: {}, success: false });
});

// --- POST SIGNUP ---
router.post('/signup', [
  body('fullName').notEmpty().withMessage('Full name is required'),
  body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email'),
  body('phone').notEmpty().withMessage('Phone is required'),
  body('password').notEmpty().withMessage('Password is required').isLength({ min: 6 }),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords do not match');
    }
    return true;
  })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('signup', { errors: errors.mapped(), formData: req.body, success: false });
  }

  try {
    const { fullName, email, phone, password } = req.body;
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.render('signup', { errors: { general: { msg: 'User already exists' } }, formData: req.body, success: false });
    }

    const newUser = new User({ fullName, email, phone, password });
    await newUser.save();

    res.render('signup', { errors: {}, formData: {}, success: true });
  } catch (err) {
    console.error(err);
    res.render('signup', { errors: { general: { msg: 'Server error, try again' } }, formData: req.body, success: false });
  }
});

module.exports = router;
