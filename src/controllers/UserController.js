const db = require('../database/dbconnection');
const { User } = require('../models/User');
const sequelize = require("../database/sequelize-connection");

const { Sequelize } = require("sequelize");



/* const renderAdd = (req, res) => {
    let user = undefined
    if (req.session.user) {
        user = req.session.user.id
    }
    return res.render("user-sign", { user });
} */


const create = async (req, res) => {
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
            res.status(200).send({msg: "usuario criado"});
        })
        .catch((err) => {
            if (err.errors[0].message.includes("must be unique")) {
                err.mensagem = err.errors[0].message.replace("must be unique", "já existente")
            } else {
                err.mensagem = err.message
            }
            res.status(400).send({ msg: "Ocorreu um erro na criação do usuário" , err: err.mensagem})

        })
}

const listAll = async (req, res) => {
    await User.findAll({
        attributes: {
            exclude: ['password', 'created_at']
        }
    }).then((users) => {
        //res.render('users-list', { users: users })
        res.status(200).send({ users: users });
    })
        .catch((err) => {
            res.status(500).send({
                msg: "Ocorreu um erro ao buscar usuários... Tente novamente!",
                err: "" + err
            });
        })
}

const listAllTasksByUser = async (req, res) => {
    await User.findAll({
        attributes: {
            exclude: ['password', 'created_at']
        }
    }).then((users) => {
        //res.render('users-list', { users: users })
        res.status(200).send({ users: users });
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