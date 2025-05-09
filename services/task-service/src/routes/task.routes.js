const { Router } = require('express');
const { body } = require('express-validator');
const TaskController = require('../controllers/task.controller');
const validate = require('../shared/middlewares/validate');

const router = Router();

router.get('/', TaskController.getAll);
router.get('/:id', TaskController.getById);
router.post('/', [
    body('title').notEmpty().withMessage('Title is required'),
    body('due_date').notEmpty().withMessage('Due date is required').isDate().withMessage('Due date must be a valid date'),
    validate
], TaskController.create);
router.put('/:id', [
    body('title').notEmpty().withMessage('Title is required'),
    body('due_date').notEmpty().withMessage('Due date is required').isDate().withMessage('Due date must be a valid date'),
    validate
], TaskController.update);
router.delete('/:id', TaskController.delete);

router.post('/:id/users', [
    body('emails').notEmpty().withMessage('Emails is required').isArray().withMessage('Emails must be an array'),
    validate
], TaskController.assignUsers);
router.delete('/:id/users', [
    body('emails').notEmpty().withMessage('Emails is required').isArray().withMessage('Emails must be an array'),
    validate
], TaskController.removeUser);

module.exports = router;