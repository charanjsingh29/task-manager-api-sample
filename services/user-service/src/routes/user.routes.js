const { Router } = require('express');
const { body } = require('express-validator');
const userController = require('../controllers/user.controller');
const auth = require('../shared/middlewares/auth');
const validate = require('../shared/middlewares/validate');

const router = Router();

router.post('/', [
  auth('user:create'),
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').if(body('phone').notEmpty()).isMobilePhone().withMessage('Valid phone number is required'),
  validate
], userController.createUser);

router.get('/', auth(['user:read', 'document:create', 'document:update']), userController.getUsers);

router.get('/profile', auth(), userController.getProfile);

router.get('/:id', auth('user:read'), userController.getUser);

router.put('/:id', [
  auth('user:update'),
  body('name').optional().notEmpty(),
  body('email').optional().isEmail(),
  body('phone').if(body('phone').notEmpty()).isMobilePhone().withMessage('Valid phone number is required'),
  validate
], userController.updateUser);

router.patch('/:id', [
  auth('user:update'),
  body('status').isIn([0, 1, 2]).withMessage('Invalid status value'),
  validate
], userController.updateStatus);

router.delete('/:id', auth('user:delete'), userController.deleteUser);

router.post("/change-password", [
  auth(),
  body("old_password").notEmpty().withMessage("Old password is required"),
  body('new_password').notEmpty().withMessage('New password is required'),
  validate
], userController.changePassword);

module.exports = router;