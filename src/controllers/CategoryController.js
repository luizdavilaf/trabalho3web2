const db = require('../database/dbconnection');
const { Task } = require('../models/Tasks');
const sequelize = require("../database/sequelize-connection");
const { Category } = require('../models/Categories');
const { User } = require('../models/User');
const { Sequelize } = require("sequelize");
const { date } = require('joi');


/**
 * renderiza para a criação de categoria
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const renderAdd = (req, res) => {
    let user = undefined
    if (req.session.user) {
        user = req.session.user
    }
    return res.render("create-category", { user });
}

/**
 * criação de categoria
 * @param {*} req 
 * @param {*} res 
 */
const create = async (req, res) => {
    var category_obj = {}
    let user = undefined
    if (req.session.user) {
        user = req.session.user
    }
    let userId = user.id
    if (req.body.title != undefined) {
        category_obj.title = req.body.title
        if (userId != undefined) {
            category_obj.userId = userId
        } else {
            throw new Error("A categoria deve ter um usuário responsável não pode ser vazio!");
        }
    } else {
        throw new Error("O titulo da categoria não pode ser vazio!");
    }
    await Category.create(category_obj)//cria categoria
        .then((Category) => {
            User.findByPk(userId).then((user) => {//associa usuario a categoria
                Category.addUser(user)
                //res.status(200).send({ Category: Category, user: user });
                req.flash('message', "Categoria criada...")
                return res.redirect("/users/categories/");
            })
        })
        .catch((err) => {
            if (err.errors[0].message.includes("must be unique")) {
                err.mensagem = err.errors[0].message.replace("must be unique", "já existente")
            } else {
                err.mensagem = err.message
            }
            res.status(400).send({ msg: "Ocorreu um erro na criação da categoria", err: err.mensagem })

        })
}


/**
 * vincula uma categoria a outro usuario
 * @param {*} req 
 * @param {*} res 
 */
const linkCategoryToUser = async (req, res) => {
    const categoryId = req.body.categoryId
    let user = undefined
    if (req.session.user) {
        user = req.session.user
    }
    let userId = user.id
    await Category.findByPk(categoryId, {
        attributes: {
            exclude: ['password', 'created_at']
        }
        ,
        include: [{
            model: Task,
            raw: true,
            required: false,
        }]
    })
        .then(async (category) => {
            await User.findByPk(userId)
                .then((user) => {
                    if(category.tasks){
                        category.tasks.forEach((task)=>{
                            task.addUser(user)
                        })                    
                    }
                    category.addUser(user)
                    //res.status(200).send({ msg: `A categoria "${category.title}" e suas tarefas foram vinculadas ao usuário "${user.name}"`, category });
                    req.flash('message', "Categoria vinculada...")
                    return res.redirect("/users/categories/");
                })
        }).catch((err) => {
            res.status(500).send({
                msg: "Ocorreu um erro ao buscar usuários... Tente novamente!",
                err: "" + err
            });
        })
}





module.exports = {
    renderAdd,
    linkCategoryToUser,
    create, 
};