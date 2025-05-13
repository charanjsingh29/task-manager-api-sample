const { Router } = require('express');
const { body } = require('express-validator');
const NotificationController = require('../controllers/notification.controller');
const validate = require('../shared/middlewares/validate');

const router = Router();

router.get('/', NotificationController.getAll);
router.post('/mark_seen', [
    body('notifications').notEmpty().withMessage('Notification Id is required'),
    validate
], NotificationController.markSeen);

module.exports = router;