const Router = require('express');
const router = new Router();
const controller = require('../controllers/authController');
const {
  validationRegistrationSchema,
  validationPasswordSchema
} = require('../widdlewares/validationSchema');
const { checkSchema } = require('express-validator');
const authMiddleware = require('../widdlewares/authMiddleware');
const roleMiddleware = require('../widdlewares/roleMiddleware');

router.get('/users',authMiddleware, roleMiddleware(['ADMINISTRATOR']), controller.getUsers);
router.get('/activation/:userId', controller.activate);

router.route('/registration').post(checkSchema(validationRegistrationSchema), authMiddleware, roleMiddleware(['ADMINISTRATOR']), controller.registration);
router.post('/login', controller.login);
router.post('/refresh', authMiddleware, controller.refresh);
router.route('/change-password').post(checkSchema(validationPasswordSchema), authMiddleware, controller.changePassword);
router.post('/forgot-password', controller.forgotPassword)
router.post('/logout', authMiddleware, controller.logout);

router.delete('/user/:id', roleMiddleware(['ADMINISTRATOR']), controller.delete);

module.exports = router;
