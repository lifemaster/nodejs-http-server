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

const upload = multer({
  storage,
  limits: {
    files: 10,
    fileSize: 52428800 // 50 Mb
  }
});

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
      const files = req.files.map(file => file.path);
      createArchive(files, 'archive')
        .then(file => res.download(file, path.basename(file)))
        .catch(err => { throw err });
    }
  });
}

function createArchive(files, archiveFileName) {
  return new Promise((resolve, reject) => {
    const archive = archiver('zip');
    const output = fs.createWriteStream(`./files/${archiveFileName}.zip`);

    files.forEach(file => {
      archive.append(fs.createReadStream(file), { name: path.basename(file) });
    });

    output.on('close', () => {
      console.log(archive.pointer() + ' total bytes');
      console.log('archiver has been finalized and the output file descriptor has closed.');
      resolve('./files/archive.zip');
    });

    output.on('end', () => {
      console.log('Data has been drained');
    });

    archive.on('waiting', err => {
      if (err.code === 'ENOENT') {
        console.log('On waiting ENOENT error: ', err);
      } else {
        reject(err);
      }
    });

    archive.on('error', err => reject(err));

    archive.pipe(output);
    archive.finalize();
  });
}
