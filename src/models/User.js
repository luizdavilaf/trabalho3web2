const { DataTypes } = require("sequelize");
const sequelize = require("../database/sequelize-connection");



const User = sequelize.define('user', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,    
  },
  email:{
    type: DataTypes.STRING,
    allowNull: false,
    unique:true,
    validate: {isEmail: true},
  },
  password: DataTypes.STRING,
  
}, {  
  modelName: 'users'
});




module.exports = { User };