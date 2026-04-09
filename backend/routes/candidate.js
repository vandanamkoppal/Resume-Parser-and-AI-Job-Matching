const express = require('express');
const router = express.Router();
const Candidate = require('../models/Candidate');

router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    const query = search ? {
      $or: [{ name: new RegExp(search,'i') },
            { skills: new RegExp(search,'i') }]
    } : {};
    const candidates = await Candidate.find(query).sort({ createdAt: -1 });
    res.json(candidates);
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    res.json(candidate);
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndUpdate(
      req.params.id, req.body, { new: true });
    res.json(candidate);
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Candidate.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;