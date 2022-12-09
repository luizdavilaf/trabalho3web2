const { DataTypes } = require("sequelize");
const sequelize = require("../database/sequelize-connection");



const Task = sequelize.define('task', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,    
  },
  deadline: {
    type: DataTypes.DATE,
  },
  done: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }

}, {
  modelName: 'tasks'
});




module.exports = { Task };