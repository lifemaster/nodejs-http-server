const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mime = require('mime-types');
const archiver = require('archiver');

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

    if (!req.files.length) {
      res.json({ message: 'No files received', data: req.body });
    } else if (req.files.length == 1) {
      const file = req.files[0].path;
      const basename = path.basename(file);
      res.download(file, basename);
    } else {
      // add files to archive and download it
      res.json({
        message: `Received files: ${req.files.length}`,
        data: req.body
      });
    }
  });
}
