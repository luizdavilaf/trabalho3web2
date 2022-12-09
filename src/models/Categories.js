const { DataTypes } = require("sequelize");
const sequelize = require("../database/sequelize-connection");



const Category = sequelize.define('category', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,    
  }  
}, {  
  modelName: 'categories'
});




module.exports = { Category };