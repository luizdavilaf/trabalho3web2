const { Router } = require('express');
const TaskController = require('../controllers/TaskController');

const router = Router();
const AuthController = require('../controllers/AuthController');
const isAuth = require('../middlewares/isAuth');
const isAdmin = require('../middlewares/isAdmin');


router.get('/', isAuth, AuthController.verifyJWT, TaskController.renderAdd);

router.post('/', isAuth, AuthController.verifyJWT, TaskController.create);

router.get('/set-done/:taskId', isAuth, AuthController.verifyJWT, TaskController.setTaskDone);

router.get('/list-by-category/', isAuth, AuthController.verifyJWT, TaskController.listbyCategory);









module.exports = router;