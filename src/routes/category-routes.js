const { Router } = require('express');
const CategoryController = require('../controllers/CategoryController');

const router = Router();
const AuthController = require('../controllers/AuthController');
const isAuth = require('../middlewares/isAuth');
const isAdmin = require('../middlewares/isAdmin');




router.post('/', CategoryController.create);

router.get('/list', CategoryController.listAll);







module.exports = router;