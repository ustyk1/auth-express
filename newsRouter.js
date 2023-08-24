const Router = require('express');
const router = new Router();
const controller = require('./newsController');
const roleMiddleware = require('./widdlewares/roleMiddleware');

router.get('/getAll', roleMiddleware(['ADMINISTRATOR', 'USER']), controller.getAll);
router.post('/create', roleMiddleware(['ADMINISTRATOR']), controller.create);
router.get('/getNews/:id', roleMiddleware(['ADMINISTRATOR', 'USER']), controller.get);
router.patch('/update/:id', roleMiddleware(['ADMINISTRATOR']), controller.update);
router.delete('/delete/:id', roleMiddleware(['ADMINISTRATOR']), controller.delete);

module.exports = router;
