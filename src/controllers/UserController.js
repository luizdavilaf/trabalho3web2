const db = require('../database/dbconnection');
const { User } = require('../models/User');
const sequelize = require("../database/sequelize-connection");
const { Task } = require('../models/Tasks');
const { Category } = require('../models/Categories');

const { Sequelize } = require("sequelize");


/**
 * renderiza para criar usuario
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const renderAdd = (req, res) => {
    let user = undefined
    if (req.session.user) {
        user = req.session.user.id
    }
    return res.render("user-sign", { user });
}

/**
 * cria usuario
 * @param {*} req 
 * @param {*} res 
 */
const create = async (req, res) => {
    let user = undefined
    if (req.session.user) {
        user = req.session.user.id
    }
    var userObj = {}
    if (req.body.name != undefined) {
        userObj.name = req.body.name
        if (req.body.email != undefined) {
            userObj.email = req.body.email
            if (req.body.password != undefined) {
                userObj.password = req.body.password
                if (userObj.password.length < 6) {
                    res.status(400).send("O campo senha deve ter pelo menos 6 caracteres!");
                } else {
                    if (req.body.img_url != undefined) {
                        userObj.img_url = req.body.img_url
                    }
                }
            } else {
                throw new Error("O campo senha não pode ser vazio!")
            }

        } else {
            throw new Error("O campo email não pode ser vazio!");
        }
    } else {
        throw new Error("O campo nome não pode ser vazio!");
    }
    await User.create(userObj)
        .then((user) => {
            //res.status(200).send({ msg: "usuario criado" });
            res.send('<script>alert("Usuario Criado..."); window.location.href = "/users/login";</script>')
        })
        .catch((err) => {
            if (err.errors[0].message.includes("must be unique")) {
                err.mensagem = err.errors[0].message.replace("must be unique", "já existente")
            } else {
                err.mensagem = err.message
            }
            res.status(400).send({ msg: "Ocorreu um erro na criação do usuário", err: err.mensagem })

        })
}
/**
 * lista todos os outros usuarios disponiveis para vincular categoria
 * @param {*} req 
 * @param {*} res 
 */
const listAll = async (req, res) => {
    let user = undefined
    if (req.session.user) {
        user = req.session.user
    }
    let userId = user.id
    var categoryId = undefined
    if(req.params.categoryId!=undefined){
        categoryId = req.params.categoryId
    }
    await User.findAll({
        attributes: {
            exclude: ['password', 'created_at']
        },
        where: {id:{[Sequelize.Op.ne]: userId}}
    }).then((users) => {        
        res.render('show-users', { users: users, categoryId: categoryId, user })
        //res.status(200).send({ users: users });
    })
        .catch((err) => {
            res.status(500).send({
                msg: "Ocorreu um erro ao buscar usuários... Tente novamente!",
                err: "" + err
            });
        })
}
/**
 * lista categorias do usuario para depois buscar as tarefas
 * @param {*} req 
 * @param {*} res 
 */
const listAllCategoriesByUser = async (req, res) => {
    var message = req.session.flash.message
    delete req.session.flash.message
    let user = undefined
    if (req.session.user) {
        user = req.session.user
    }
    const userId = user.id
    
    await Category.findAll({        
        include: [{
            model: User,
            where: { id: userId }
        }],
        raw: true
    }).then((Categories) => {        
        res.render('show-categories2', { categories: Categories, user, message });
    })
        .catch((err) => {
            res.status(500).send({
                msg: "Ocorreu um erro ao listas as categorias do usuario... Tente novamente!",
                err: "" + err
            });
        })
}
/**
 * lista todas categorias para vincular a outro usuario
 * @param {*} req 
 * @param {*} res 
 */
const listAllCategoriesByUserToLink = async (req, res) => {
    let user = undefined
    if (req.session.user) {
        user = req.session.user
    }
    const userId = user.id
    
    await Category.findAll({
        include: [{
            model: User,
            where: { id: userId }
        }],
        raw: true
    }).then((Categories) => {
        //res.render('users-list', { users: users })
        //console.log(Categories)
        res.render('show-categories-to-link', { categories: Categories, user });
    })
        .catch((err) => {
            res.status(500).send({
                msg: "Ocorreu um erro ao buscar usuários... Tente novamente!",
                err: "" + err
            });
        })
}





module.exports = {
    renderAdd,
    listAllCategoriesByUserToLink,
    listAllCategoriesByUser,
    /* listAllTasksByUser, */
    create,
    listAll,
};