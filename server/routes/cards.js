const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { Card } = require('../models');

router.post('/', auth, async (req, res) => {
  try {
    const { title, description, columnId, order } = req.body;
    const card = await Card.create({ title, description, columnId, order });
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

module.exports = router;