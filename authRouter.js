const Router = require('express');
const router = new Router();
const controller = require('./authController');
const validationSchema = require('./widdlewares/validationSchema');
const { checkSchema } = require('express-validator');
const authMiddleware = require('./widdlewares/authMiddleware');
const roleMiddleware = require('./widdlewares/roleMiddleware');

router.route('/registration').post(checkSchema(validationSchema), controller.registration);
router.post('/login', controller.login);
router.get('/users',authMiddleware, roleMiddleware(['ADMINISTRATOR']), controller.getUsers);
router.delete('/user/:id', roleMiddleware(['ADMINISTRATOR']), controller.delete);

router.post('/news', roleMiddleware(['ADMINISTRATOR']), controller.delete);
router.get('/news/:id', roleMiddleware(['ADMINISTRATOR']), controller.delete);
router.get('/news', roleMiddleware(['ADMINISTRATOR']), controller.delete);


module.exports = router;
