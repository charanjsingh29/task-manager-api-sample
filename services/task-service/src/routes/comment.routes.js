const { Router } = require('express');
const CommentController = require('../controllers/comment.controller');
const validate = require('../shared/middlewares/validate');
const isMineTaskMiddleware = require('../middlewares/is_mine_task.middleware');
const { body } = require('express-validator');

const router = Router();

router.post('/:id/comments', [
    body('comment').notEmpty().withMessage('Comment is required'),
    validate,
    isMineTaskMiddleware
], CommentController.create);

router.get('/:id/comments', [
    isMineTaskMiddleware
], CommentController.getAll);

router.put('/:id/comments/:comment_id', [
    body('comment').notEmpty().withMessage('Comment is required'),
    validate,
    isMineTaskMiddleware
], CommentController.update);

router.delete('/:id/comments/:comment_id', [
    isMineTaskMiddleware
], CommentController.delete);

module.exports = router;