const db = require('../database/dbconnection');
const { Task } = require('../models/Tasks');
const sequelize = require("../database/sequelize-connection");
const { Category } = require('../models/Categories');
const { User } = require('../models/User');
const { Sequelize } = require("sequelize");
const { date } = require('joi');



/* const renderAdd = (req, res) => {
    let user = undefined
    if (req.session.user) {
        user = req.session.user.id
    }
    return res.render("user-sign", { user });
} */


const create = async (req, res) => {
    var category_obj = {}

    if (req.body.title != undefined) {
        category_obj.title = req.body.title
        if (req.body.userId != undefined) {
            category_obj.userId = req.body.userId
        } else {
            throw new Error("A categoria deve ter um usuário responsável não pode ser vazio!");
        }
    } else {
        throw new Error("O titulo da categoria não pode ser vazio!");
    }
    await Category.create(category_obj)
        .then((Category) => {
            User.findByPk(req.body.userId).then((user) => {
                Category.addUser(user)
                res.status(200).send({ Category: Category, user:user });
            })
           
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

const listAll = async (req, res) => {
    await Category.findAll({
        include: User
    }).then((Category) => {
        //res.render('users-list', { users: users })
       
            res.status(200).send({ Category: Category });
        
    })
        .catch((err) => {
            res.status(500).send({
                msg: "Ocorreu um erro ao buscar usuários... Tente novamente!",
                err: "" + err
            });
        })
}





module.exports = {

    create,
    listAll,
};