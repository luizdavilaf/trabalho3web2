const { Router } = require('express');
const UserController = require('../controllers/UserController');

const router = Router();
const AuthController = require('../controllers/AuthController');
const isAuth = require('../middlewares/isAuth');
const isAdmin = require('../middlewares/isAdmin');

router.post('/login', AuthController.login);

router.get('/logout', AuthController.logout);

router.get('/login', AuthController.renderLogin);

router.post('/', UserController.create);

router.get('/', UserController.renderAdd);

router.get('/list/:categoryId', isAuth, AuthController.verifyJWT, UserController.listAll);

/* router.get('/list/tasks/:userId', UserController.listAllTasksByUser); */

router.get('/categories', isAuth, AuthController.verifyJWT, UserController.listAllCategoriesByUser); 

router.get('/categories-to-link', isAuth, AuthController.verifyJWT, UserController.listAllCategoriesByUserToLink);



module.exports = router;