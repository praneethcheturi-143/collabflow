const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Column = sequelize.define('Column', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  order: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  boardId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
});

module.exports = Column;