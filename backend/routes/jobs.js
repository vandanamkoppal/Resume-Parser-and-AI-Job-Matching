const express = require('express');
const router = express.Router();
const Job = require('../models/Job');

router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/match/:jobId', async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ error: 'Job not found' });

    const { skills, experience } = req.body;
    if (!skills || !Array.isArray(skills))
      return res.status(400).json({ error: 'Invalid skills data' });

    const matchedSkills = skills.filter(s =>
      job.skills.map(j => j.toLowerCase()).includes(s.toLowerCase()));
    const missingSkills = job.skills.filter(s =>
      !skills.map(k => k.toLowerCase()).includes(s.toLowerCase()));

    const skillScore = (matchedSkills.length / job.skills.length) * 70;
    const expScore = experience >= job.experience ? 30 :
      (experience / job.experience) * 30;
    const totalScore = Math.round(skillScore + expScore);

    res.json({
      totalScore,
      matchedSkills,
      missingSkills,
      experienceGap: Math.max(0, job.experience - experience),
      color: totalScore > 70 ? 'green' : totalScore >= 40 ? 'yellow' : 'red'
    });
  } catch(err) {
    console.error('Match error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;