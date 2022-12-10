const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(cors());
app.use(express.static('public'));
app.get('/', (_, res) => {
  res.sendFile(__dirname + '/views/index.html');
});
app.use(bodyParser.urlencoded({ extended: false }));

app.use(require('./routes'));

app.get('/api', (req, res) => {
  res.end('Hello!');
});

module.exports = app;
