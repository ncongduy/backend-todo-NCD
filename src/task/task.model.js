import {DataTypes} from 'sequelize';

import db from '../config/db.js';

const Task = db.define('Task', {
  description: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: true,
      isAlpha: true,
      notEmpty: true,
    },
  },
  isCompleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

Task.sync({alter: true})
  .then(() => {
    console.log('Table Task sychronize successfully.');
  })
  .catch((error) => console.error('Table Task can not sychronize with error: ', error));

export default Task;
