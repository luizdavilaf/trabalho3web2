const { Router } = require('express');
const CategoryController = require('../controllers/CategoryController');

const router = Router();
const AuthController = require('../controllers/AuthController');
const isAuth = require('../middlewares/isAuth');
const isAdmin = require('../middlewares/isAdmin');


router.get('/', isAuth, AuthController.verifyJWT, CategoryController.renderAdd);

router.post('/', isAuth, AuthController.verifyJWT, CategoryController.create);

router.post('/link-user', isAuth, AuthController.verifyJWT, CategoryController.linkCategoryToUser);








module.exports = router;