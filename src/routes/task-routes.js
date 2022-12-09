const { Router } = require('express');
const TaskController = require('../controllers/TaskController');

const router = Router();
const AuthController = require('../controllers/AuthController');
const isAuth = require('../middlewares/isAuth');
const isAdmin = require('../middlewares/isAdmin');




router.post('/', TaskController.create);

router.get('/list', TaskController.listAll);







module.exports = router;