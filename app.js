const express = require('express');
const multiparty = require('multiparty');

const app = express();

app.use(express.static('public'));

app.post('/api', (req, res, next) => {
  const form = new multiparty.Form({
    autoFields: true,
    autoFiles: true,
    uploadDir: './files/',
    maxFilesSize: 10485760
  });

  form.parse(req, (err, fields, files) => {
    if (err) {
      return next(err.message);
    }

    console.log(`Uploaded files: ${files.files.length}`);

    res.set({ 'Content-Type': 'text/plain' });
    res.json({
      message: 'Received ' + files.files.length + ' files',
      data: fields
    });
  });
});

app.listen(1234, () => console.log('Server is listening on port 1234'));
