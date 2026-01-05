const sequelize = require('../config/database');
const User = require('./User');
const Board = require('./Board');
const Column = require('./Column');
const Card = require('./Card');

User.hasMany(Board, { foreignKey: 'ownerId' });
Board.belongsTo(User, { foreignKey: 'ownerId' });

Board.hasMany(Column, { foreignKey: 'boardId' });
Column.belongsTo(Board, { foreignKey: 'boardId' });

Column.hasMany(Card, { foreignKey: 'columnId' });
Card.belongsTo(Column, { foreignKey: 'columnId' });

module.exports = { sequelize, User, Board, Column, Card };