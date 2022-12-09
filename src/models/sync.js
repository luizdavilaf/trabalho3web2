const sequelize = require("../database/sequelize-connection");

const { User } = require('./User');
const { Category } = require('./Categories');
const { Task } = require('./Tasks');

Task.belongsTo(Category)
Category.hasMany(Task)

User.belongsToMany(Category, { through: 'User_Categories' });
Category.belongsToMany(User, { through: 'User_Categories' });


Task.belongsTo(User)
User.hasMany(Task)






console.log('Sync Models');
sequelize.sync();

