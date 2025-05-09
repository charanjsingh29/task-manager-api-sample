const { Router } = require('express');
const CommentController = require('../controllers/comment.controller');
const validate = require('../shared/middlewares/validate');
const { body } = require('express-validator');

const router = Router();

router.post('/:id/comments', [
    body('task_id').notEmpty().withMessage('Task ID is required'),
    body('file').notEmpty().withMessage('File is required'),
    validate
], CommentController.create);

router.get('/:id/comments', CommentController.getAll);

router.put('/:id/comments/:comment_id', CommentController.update);

router.delete('/:id/comments/:comment_id', CommentController.delete);

module.exports = router;