const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { Board, Column } = require('../models');

router.get('/', auth, async (req, res) => {
  try {
    const boards = await Board.findAll({ where: { ownerId: req.user.id } });
    res.json(boards);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const board = await Board.create({ title: req.body.title, ownerId: req.user.id });
    await Column.bulkCreate([
      { title: 'To Do', order: 0, boardId: board.id },
      { title: 'In Progress', order: 1, boardId: board.id },
      { title: 'Done', order: 2, boardId: board.id },
    ]);
    res.status(201).json(board);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const board = await Board.findByPk(req.params.id, {
      include: {
        association: 'Columns',
        include: ['Cards'],
      },
    });
    if (!board) return res.status(404).json({ message: 'Board not found' });
    res.json(board);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const board = await Board.findByPk(req.params.id);
    if (!board) return res.status(404).json({ message: 'Board not found' });
    if (board.ownerId !== req.user.id) return res.status(403).json({ message: 'Not authorized' });
    await board.destroy();
    res.json({ message: 'Board deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;