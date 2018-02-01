const express = require('express');

const app = express();

app.use(express.static('public'));

// Connect routes
require('./routes')(app);

app.listen(1234, () => console.log('Server is listening on port 1234'));
