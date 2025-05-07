const { Router } = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/auth.controller');
const validate = require('../shared/middlewares/validate');

const router = Router();

router.post('/register', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').if(body('phone').notEmpty()).isMobilePhone().withMessage('Valid phone number is required'),
  validate
], authController.register);

router.post('/login', [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
  validate
], authController.login);

router.post('/logout', authController.logout);

router.post('/refresh', [], authController.refresh);

module.exports = router;