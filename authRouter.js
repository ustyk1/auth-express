const Router = require('express');
const router = new Router();
const controller = require('./authController');
const {passwordCheck} = require('./widdlewares/validationRules');

router.route('/registration').post(passwordCheck, controller.registration);
router.post('/login', controller.login);
router.get('/users', controller.getUsers);

module.exports = router;
