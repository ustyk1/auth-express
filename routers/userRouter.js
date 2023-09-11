const Router = require('express');
const router = new Router();
const controller = require('../controllers/userController');
const { validationUpdateUserSchema} = require('../widdlewares/validationSchema');
const { checkSchema } = require('express-validator');
const authMiddleware = require('../widdlewares/authMiddleware');
const roleMiddleware = require('../widdlewares/roleMiddleware');

router.route('/update-profile').post(checkSchema(validationUpdateUserSchema), authMiddleware, controller.updateProfile);
router.route('/update-user').post(checkSchema(validationUpdateUserSchema), authMiddleware, roleMiddleware(['ADMINISTRATOR']), controller.updateUser);

module.exports = router;
