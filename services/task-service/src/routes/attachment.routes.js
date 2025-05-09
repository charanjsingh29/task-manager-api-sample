const { Router } = require('express');
const AttachmentController = require('../controllers/attachment.controller');
const validate = require('../shared/middlewares/validate');
const { body } = require('express-validator');

const router = Router();

router.post('/:id/attachments', [
    body('task_id').notEmpty().withMessage('Task ID is required'),
    body('file').notEmpty().withMessage('File is required'),
    validate
], AttachmentController.create);

router.get('/:id/attachments', AttachmentController.getAll);

router.delete('/:id/attachments/:attach_id', AttachmentController.delete);

module.exports = router;