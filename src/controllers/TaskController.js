const db = require('../database/dbconnection');
const { Task } = require('../models/Tasks');
const sequelize = require("../database/sequelize-connection");
const { User } = require('../models/User');
const { Sequelize } = require("sequelize");
const { date } = require('joi');
const { Category } = require('../models/Categories');


/**
 * renderiza para adicionar tarefa
 * @param {*} req 
 * @param {*} res 
 */
const renderAdd = (req, res) => {
    let user = undefined
    if (req.session.user) {
        user = req.session.user
    }
    Category.findAll({
        include: [{
            model: User,
            where: { id: user.id },
        }], 
       
        raw:true
        
    }).then((categories)=>{
        return res.render("create-task", { user, categories });
    }).catch((err)=>{
        console.log(err)
    })
    
}

/**
 * criação de tarefa
 * @param {*} req 
 * @param {*} res 
 */
const create = async (req, res) => {
    var taskObj = {}
    let user = undefined
    if (req.session.user) {
        user = req.session.user
    }

    if (req.body.title != undefined) {
        taskObj.title = req.body.title
        if (req.body.description != undefined) {
            taskObj.description = req.body.description
            if (req.body.categoryId != undefined && req.body.categoryId !="noCategory") {
                taskObj.categoryId = req.body.categoryId
            }
            if (req.body.deadline != undefined) {
                taskObj.deadline = new Date(req.body.deadline)
                if (user != undefined) {
                    taskObj.userId = user.id
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
            req.flash('message', "tarefa criada")
            return res.redirect("/users/categories");
            //res.status(200).send({ msg: "tarefa criada", task });
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
 * definir tarefa como concluida
 * @param {*} req 
 * @param {*} res 
 */
const setTaskDone = async (req, res) => {
    const taskId = req.params.taskId    
    let user = undefined
    if (req.session.user) {
        user = req.session.user
    }
    const userId = user.id
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
                    res.send('<script>alert("Tarefa Concluída");window.location=document.referrer; </script>')
                    //res.status(200).send({ msg: "tarefa concluída!", task: result });
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
/**
 * listar tarefas de uma categoria especifica ou sem categoria
 * @param {*} req 
 * @param {*} res 
 */
const listbyCategory = async (req, res) => {
    let user = undefined
    if (req.session.user) {
        user = req.session.user
    }
    const userId = user.id
    const categoryId = req.query.categoryId    
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
    if (req.query.pending != undefined && req.query.pending == "on") {
        query.where = { done: false }
        pending = "on"
    }
    if (req.query.outdated != undefined && req.query.outdated == "on") {
        query.where = { deadline: { [Sequelize.Op.lte]: currentDate }, done: false }
        outdated = "on"
    }
   
    
    if (categoryId == "noCategory") {
        query['where'] = { categoryId: null }   
        query.include = [{
            model: User,
            where: { id: userId }
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
        res.render('show-tasks', { tasks, page, limit, totalPages, previous, next, categoryId, outdated, pending, user });

        //res.status(200).send({ tasks: tasks });
    })
        .catch((err) => {
            res.status(500).send({
                msg: "Ocorreu um erro ao buscar usuários... Tente novamente!",
                err: "" + err
            });
        })
}

/**
 * deletar tarefa
 * @param {*} req 
 * @param {*} res 
 */
const hardDelete = async (req, res) => {
    const taskId = req.query.taskId  
    
    await Task.destroy({ where: { id: taskId }}).then((result) => {
        req.flash('message', "tarefa excluída")
        return res.redirect("/users/categories");       
       
    })
        .catch((err) => {
            res.status(500).send({
                msg: "Ocorreu um erro ao buscar usuários... Tente novamente!",
                err: "" + err
            });
        })
}




module.exports = {
    hardDelete,
    renderAdd,
    listbyCategory,
    setTaskDone,
    create,
   
};