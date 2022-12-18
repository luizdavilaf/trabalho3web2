const db = require('../database/dbconnection');
const { Task } = require('../models/Tasks');
const sequelize = require("../database/sequelize-connection");
const { User } = require('../models/User');
const { Sequelize } = require("sequelize");
const { date } = require('joi');
const { Category } = require('../models/Categories');



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
            if (req.body.categoryId != undefined) {
                taskObj.categoryId = req.body.categoryId
            }
            if (req.body.deadline != undefined) {
                taskObj.deadline = new Date(req.body.deadline)
                if (req.body.userId != undefined) {
                    taskObj.userId = req.body.userId
                } else {
                    throw new Error("A tarefa deve ter um usuário responsável não pode ser vazio!");
                }
            } else {
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
            task.addUser(taskObj.userId)
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

const listAllbyUser = async (req, res) => {
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

const setTaskDone = async (req, res) => {
    const taskId = req.params.taskId
    const userId = req.body.userId
    await Task.findByPk(taskId, {
        where: { 'User.id': userId },
        include: [{
            model: User,
        }]
    }).then((task) => {
        if (!task) {
            return res.status(500).send({
                msg: "Tarefa não encontrada ou usuário não tem permissão para editar",
            })
        } else {
            task.setDataValue('done', true)
            task.save()
                .then((result) => {
                    res.status(200).send({ msg: "tarefa concluída!", task: result });
                })
        }
        //res.render('tasks-list', { tasks: tasks })

    })
        .catch((err) => {
            res.status(500).send({
                msg: "Ocorreu um erro ao buscar usuários... Tente novamente!",
                err: "" + err
            });
        })
}

const listbyCategory = async (req, res) => {
    const categoryId = req.query.categoryId
    console.log(categoryId)
    const currentDate = new Date(Date.now())
    var page =1
    var limit= 5
    var outdated = "off"
    var pending = "off"
    var query = {}
    
    if (req.query.limit != undefined) {        
        limit = parseInt(req.query.limit)      
    }
    query = {
        limit: limit,
        order: sequelize.literal('task.deadline DESC')
    }
    if (req.query.page != undefined) {       
        page = parseInt(req.query.page)
    }
    if (req.query.outdated != undefined && req.query.outdated == "on") {
        query.where = { deadline: { [Sequelize.Op.lte]: currentDate }, done: false }
        outdated = "on"
    }
    if (req.query.pending != undefined && req.query.pending == "on") {
        query.where = { done: false }
        pending = "on"
    }

    if (categoryId == "noCategory") {
        query.include = 
             [{
                model: Category,
                where: { id: { [Sequelize.Op.eq]: null } }
            }]       
    } else {
        query.include = [{
                model: Category,
                where: { id: categoryId }
            }]        
    }
    query.offset = -1
    if (page > 1) {
        query.offset = limit * (page - 1)
    }
    var previous = page - 1
    var next = page + 1
    
    await Task.findAndCountAll(query).then((result) => {
        var tasks = result.rows
        totalPages = parseInt(Math.ceil(result.count / limit))
        res.render('show-tasks', { tasks, page, limit, totalPages, previous, next, categoryId, outdated, pending });

        //res.status(200).send({ tasks: tasks });
    })
        .catch((err) => {
            res.status(500).send({
                msg: "Ocorreu um erro ao buscar usuários... Tente novamente!",
                err: "" + err
            });
        })
}




module.exports = {
    listbyCategory,
    setTaskDone,
    create,
    listAll,
};