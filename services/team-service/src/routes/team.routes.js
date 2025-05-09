const { Router } = require('express');
const { body } = require('express-validator');
const TeamController = require('../controllers/team.controller');
const validate = require('../shared/middlewares/validate');

const router = Router();

router.get('/', TeamController.getAll);
router.get('/:id', TeamController.getById);

router.post('/', [
    body('name').notEmpty().withMessage('Name is required'),
    validate
  ], TeamController.create);
router.put('/:id', [
    body('name').notEmpty().withMessage('Name is required'),
    validate
  ], TeamController.update);
router.delete('/:id', TeamController.delete);
router.post('/:id/users', [
    body('emails')
        .isArray().withMessage('User Ids must be an array')
        .custom((value) => {
            if (Array.isArray(value) && value.length === 0) {
                throw new Error('User Ids array cannot be empty');
            }
            return true;
        }),
    validate
], TeamController.assignUsers);
router.get('/:id/users', TeamController.allUsers);
router.delete('/:id/users/:user_id', TeamController.removeUser);
module.exports = router;