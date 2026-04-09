const mongoose = require('mongoose');
const JobSchema = new mongoose.Schema({
    title: String,
    code: String,
    skills: [String],
    experience: Number,
    location: String,
    description: String,
});
module.exports = mongoose.model('Job', JobSchema);