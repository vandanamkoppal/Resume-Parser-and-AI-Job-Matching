const express = require('express');
const router = express.Router();
const pdfParse = require('pdf-parse');
const fs = require('fs');
const upload = require('../middleware/upload');
const Candidate = require('../models/Candidate');

function parseResume(text) {
  if (!text) return {};

  const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
  const phoneMatch = text.match(/(\+?\d[\d\s\-().]{7,}\d)/);
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  const skillKeywords = ['javascript','react','node','python','mongodb',
    'express','html','css','java','sql','typescript','git','aws'];
  const skills = skillKeywords.filter(s =>
    text.toLowerCase().includes(s));

  let experience = 0;
  const expMatch = text.match(/(\d{1,2})\s*\+?\s*years?/i);
  if (expMatch) experience = parseInt(expMatch[1]);

  return {
    name: lines[0] || 'Unknown',
    email: emailMatch ? emailMatch[0] : '',
    phone: phoneMatch ? phoneMatch[1] : '',
    skills,
    experience,
    education: text.toLowerCase().includes('master') ? 'Master' :
               text.toLowerCase().includes('bachelor') ? 'Bachelor' : 'Other',
    currentCompany: ''
  };
}

router.post('/', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const dataBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdfParse(dataBuffer);

    if (!pdfData || !pdfData.text)
      return res.status(400).json({ error: 'Could not parse PDF' });

    const parsed = parseResume(pdfData.text);
    const candidate = new Candidate({ ...parsed, resumePath: req.file.path });
    await candidate.save();
    res.json({ success: true, candidate });
  } catch (err) {
    console.error('Upload error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;