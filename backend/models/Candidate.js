const mongoose = require('mongoose');

const CandidateSchema = new mongoose.Schema({
    name: String, 
    email: String,
    phone: String,
    skills: [String],
    experience: Number,
    education: String,
    currentCompany: String,
    resumePath: String,
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Candidate', CandidateSchema);