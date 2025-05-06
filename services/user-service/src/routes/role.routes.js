const { Router } = require('express');
const { body } = require('express-validator');
const roleController = require('../controllers/role.controller');
const auth = require('../shared/middlewares/auth');
const validate = require('../shared/middlewares/validate');

const router = Router();

router.post('/', [
  auth('role:create'),
  body('name').notEmpty().withMessage('Role name is required'),
  body('permissions').optional().isArray(),
  validate
], roleController.createRole);

router.get('/', auth(['role:read', 'user:create', 'user:update']), roleController.getRoles);

router.get('/:id', auth('role:read'), roleController.getRoleById);

router.put('/:id', [
  auth('role:update'),
  body('name').optional().notEmpty(),
  body('permissions').optional().isArray(),
  validate
], roleController.updateRole);

router.delete('/:id', auth('role:delete'), roleController.deleteRole);

module.exports = router;