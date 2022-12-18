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

/* router.get('/', UserController.renderAdd); */

router.get('/list/:categoryId', UserController.listAll);
/* 
router.get('/:username', UserController.detailByUsername);

router.delete('/:cpf', UserController.deleteByCpf); */

router.get('/list/tasks/:userId', UserController.listAllTasksByUser);

router.get('/categories', isAuth, AuthController.verifyJWT, UserController.listAllCategoriesByUser); 

router.get('/categories-to-link', isAuth, UserController.listAllCategoriesByUserToLink);



module.exports = router;