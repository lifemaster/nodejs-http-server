const multer = require('multer');
const path = require('path');
const fs = require('fs');

// create folder for files if it doesn't exist
try {
  fs.mkdirSync('./files');
} catch (err) {
  if (err && err.code == 'EEXIST' && !fs.statSync('./files').isDirectory()) {
    throw err;
  }
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './files');
  },
  filename: (req, file, cb) => {
    const filename = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, filename + ext);
  }
});

const upload = multer({ storage });

module.exports = function(app) {
  app.post('/api', upload.array('files'), (req, res, next) => {
    console.log(`[POST -> /api]: Received files(${req.files.length}):`, req.files);
    console.log('[POST -> /api]: Received fields: ', req.body);
    res.json({
      message: `Received files: ${req.files.length}`,
      data: req.body
    });
  });
}
