const {DataTypes} = require('sequelize');

const db = require('../config/db.js');

const Task = db.define('Task', {
  description: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: true,
      notEmpty: true,
    },
  },
  isCompleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notNull: true,
      notEmpty: true,
    },
  },
});

Task.sync({alter: true})
  .then(() => {
    console.log('Table Task sychronize successfully.');
  })
  .catch((error) => console.error('Table Task can not sychronize with error: ', error));

module.exports = Task;
