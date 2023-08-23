const Router = require('express');
const router = new Router();
const controller = require('./authController');
const validationSchema = require('./widdlewares/validationSchema');
const { checkSchema } = require('express-validator');

router.route('/registration').post(checkSchema(validationSchema), controller.registration);
router.post('/login', controller.login);
router.get('/users', controller.getUsers);

module.exports = router;
