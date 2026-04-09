const express = require('express');
const router = express.Router();
const Candidate = require('../models/Candidate');

router.get('/', async (req, res) => {
  const { search } = req.query;
  const query = search ? { 
    $or: [{ name: new RegExp(search,'i') }, 
          { skills: new RegExp(search,'i') }] 
  } : {};
  const candidates = await Candidate.find(query).sort({ createdAt: -1 });
  res.json(candidates);
});

router.get('/:id', async (req, res) => {
  const candidate = await Candidate.findById(req.params.id);
  res.json(candidate);
});

router.put('/:id', async (req, res) => {
  const candidate = await Candidate.findByIdAndUpdate(
    req.params.id, req.body, { new: true });
  res.json(candidate);
});

module.exports = router;