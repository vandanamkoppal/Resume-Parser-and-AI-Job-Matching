require('dotenv').config();
const mongoose = require('mongoose');
const Job = require('./models/Job');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  await Job.deleteMany({});
  await Job.insertMany([
    { title: 'Frontend Developer', code: 'FE001', 
      skills: ['React','JavaScript','HTML','CSS'], experience: 2, 
      location: 'Remote', description: 'Build UI components' },
    { title: 'Backend Developer', code: 'BE001', 
      skills: ['Node','Express','MongoDB','JavaScript'], experience: 3, 
      location: 'Hybrid', description: 'Build REST APIs' },
    { title: 'Full Stack Developer', code: 'FS001', 
      skills: ['React','Node','MongoDB','JavaScript','CSS'], experience: 4, 
      location: 'Onsite', description: 'End to end development' },
  ]);
  console.log('Seeded!');
  process.exit();
});