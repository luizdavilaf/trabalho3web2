const sequelize = require("../database/sequelize-connection");

const { User } = require('./User');
const { Category } = require('./Categories');
const { Task } = require('./Tasks');



User.belongsToMany(Category, { through: 'User_Categories' });
Category.belongsToMany(User, { through: 'User_Categories' });


Task.belongsToMany(User, { through: 'User_Tasks' })
User.belongsToMany(Task, { through: 'User_Tasks' })


Task.belongsTo(Category)
Category.hasMany(Task)



console.log('Sync Models');
sequelize.sync();

