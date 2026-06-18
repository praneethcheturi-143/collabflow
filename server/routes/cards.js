const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { Card, User } = require('../models');
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Comment = sequelize.define('Comment', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  text: { type: DataTypes.TEXT, allowNull: false },
  cardId: { type: DataTypes.UUID, allowNull: false },
  userId: { type: DataTypes.UUID, allowNull: false },
  username: { type: DataTypes.STRING, allowNull: false },
});

Comment.sync({ alter: true });

router.post('/', auth, async (req, res) => {
  try {
    const { title, description, columnId, order, label, dueDate } = req.body;
    const card = await Card.create({ title, description, columnId, order, label, dueDate });
    res.status(201).json(card);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const card = await Card.findByPk(req.params.id);
    if (!card) return res.status(404).json({ message: 'Card not found' });
    await card.update(req.body);
    res.json(card);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const card = await Card.findByPk(req.params.id);
    if (!card) return res.status(404).json({ message: 'Card not found' });
    await card.destroy();
    res.json({ message: 'Card deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id/comments', auth, async (req, res) => {
  try {
    const comments = await Comment.findAll({
      where: { cardId: req.params.id },
      order: [['createdAt', 'ASC']],
    });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/:id/comments', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    const comment = await Comment.create({
      text: req.body.text,
      cardId: req.params.id,
      userId: req.user.id,
      username: user.username,
    });
    res.status(201).json(comment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;