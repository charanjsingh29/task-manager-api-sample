const { Router } = require('express');
const { body } = require('express-validator');
const { getUsersByEmail, getUsers, getUser } = require('../controllers/user.controller');
const validate = require('../shared/middlewares/validate');

const router = Router();

router.post('/users_by_email', [
    body('emails').isArray(),
    validate
], getUsersByEmail);
router.post('/users/', getUsers);
router.get('/users/:id', getUser);
module.exports = router;