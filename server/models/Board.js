const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Board = sequelize.define('Board', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ownerId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  color: {
  type: DataTypes.STRING,
  defaultValue: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
},
});

module.exports = Board;