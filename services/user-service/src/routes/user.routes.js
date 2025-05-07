const { Router } = require('express');
const { body } = require('express-validator');
const userController = require('../controllers/user.controller');
const auth = require('../shared/middlewares/auth');
const validate = require('../shared/middlewares/validate');

const router = Router();

router.get('/', auth(['user:read', 'document:create', 'document:update']), userController.getUsers);

router.get('/profile', auth(), userController.getProfile);

router.get('/:id', auth('user:read'), userController.getUser);

router.delete('/:id', auth('user:delete'), userController.deleteUser);

router.post("/change-password", [
  auth(),
  body("old_password").notEmpty().withMessage("Old password is required"),
  body('new_password').notEmpty().withMessage('New password is required'),
  validate
], userController.changePassword);

module.exports = router;