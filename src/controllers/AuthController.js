const db = require('../database/dbconnection');
const { User } = require('../models/User');
const jwt = require('jsonwebtoken');
const SECRET = 'luizdavilaf'


const renderLogin = (req, res) => {
    var user = undefined
    return res.render("login", { user });
}

const login = async (req, res) => {

    const email = req.body.email;
    const password = req.body.password;

    await User.findOne({ where: { email: email } })
        .then((user1) => {
            if (!user1) {
                return res.status(400).send({ msg: "usuario nao encontrado" });
            }
            if (password != user1.password) {
                return res.status(400).send({ msg: "Senha Invalida!" });

            } else {
                const token = jwt.sign({ user: user1.id }, SECRET, { expiresIn: 3600 })
                req.session.user = { id: user1.dataValues.id, name: user1.dataValues.name, email: user1.dataValues.email, token: token }

                

                req.flash('message', "logado...")
                return res.redirect("/users/categories/");
                //res.send('<script>alert("Logado..."); window.location.href = "/users/categories";</script>')
                //res.redirect('/users/categories')
            }

        })
        .catch((err) => {
            console.log(err)
            res.status(500).send(err);
        })



}

const logout = (req, res) => {
    if (req.session) {
        req.session.destroy();
        return res.status(200).send('<script>alert("Você foi deslogado!"); window.location.href="/" ; </script>');
    }
    return res.redirect("/")
}

const verifyJWT = (req, res, next) => {
    const token = req.session.user.token    
    jwt.verify(token, SECRET, (err, decoded) => {
        if (err) return res.status(401).send("erro de verificação do token")
        req.userId = decoded.userId
        next()
    })
}

module.exports = {
    verifyJWT,
    logout,
    login,
    renderLogin
}