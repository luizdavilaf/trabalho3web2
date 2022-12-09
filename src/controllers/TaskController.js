const db = require('../database/dbconnection');
const { Task } = require('../models/Tasks');
const sequelize = require("../database/sequelize-connection");
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
    var taskObj = {}

    if (req.body.title != undefined) {
        taskObj.title = req.body.title
        if (req.body.description != undefined) {
            taskObj.description = req.body.description
            if (req.body.category != undefined) {
                taskObj.categoryId = req.body.categoryId
            }
            if(req.body.deadline!=undefined){
                taskObj.deadline =  new Date(req.body.deadline)                
                if (req.body.userId != undefined) {
                    taskObj.userId = req.body.userId
                } else {
                    throw new Error("A tarefa deve ter um usuário responsável não pode ser vazio!");
                }    
            }else{
                throw new Error("O campo data prevista de conclusão não pode ser vazio!");
            }
        } else {
            throw new Error("O campo email não pode ser vazio!");
        }
    } else {
        throw new Error("O titulo da tarefa não pode ser vazio!");
    }
    await Task.create(taskObj)
        .then((task) => {
            res.status(200).send({ msg: "tarefa criada", task });
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
    await Task.findAll({
        include: [{ model: User, }]
    }).then((tasks) => {
        //res.render('tasks-list', { tasks: tasks })
        res.status(200).send({ tasks: tasks });
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