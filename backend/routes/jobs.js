const express = require('express');
const router = express.Router();
const Job = require('../models/Job');

router.get('/', async (req, res) => {
    const jobs = await Job.find();
    res.json(jobs);
});

router.post('/match/:jobId', async (req, res) => {
    const job = await Job.findById(req.params.jobId);
    const { skills, experience } = req.body;

    const matchedSkills = skills.filter(s => job.skills.map(j => j.toLowerCase()).includes(s.toLowerCase()));
    const missingSkills = job.skills.filter(s => !skills.map(s => !skills.map(k => k.toLowerCase()).includes(s.toLowerCase())));

    const skillScore = (matchedSkills.length / job.skills.length) * 70;
    const expoScore = experience >= job.experience ? 30 : (experience / job.experience) * 30;
    const totalScore = Math.round(skillScore + expoScore);

    res.json({ totalScore, matchedSkills, missingSkills, experienceGap: Math.max(0, job.experience - experience),
        color: totalScore = 70 ? 'green' : totalScore >= 40 ? 'yellow' : 'red'
    });

    });

module.exports = router;