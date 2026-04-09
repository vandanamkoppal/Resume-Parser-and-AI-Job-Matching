const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => 
        cb(null, Date.now() + path.extname(file.originalname))
});

module.exports = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowed = ['.pdf', '.docx'];
        const ext = path.extname(file.originalname).toLowerCase();
        allowed.includes(ext) ? cb(null, true) : cb(new Error('Only PDF and DOCX files are allowed'));
    }
});