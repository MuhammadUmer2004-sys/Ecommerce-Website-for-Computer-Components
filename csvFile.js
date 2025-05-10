const multer = require('multer');
const path = require('path');

const upload = multer({
    dest: 'uploads/', // Save to 'uploads/' directory
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        if (ext !== '.csv') {
            return cb(new Error('Only CSV files are allowed!'), false);
        }
        cb(null, true);
    },
});

module.exports = upload;