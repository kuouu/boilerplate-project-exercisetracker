const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser');
const dbo = require('./db');
require('dotenv').config()

const PORT = process.env.PORT || 3000;

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(require('./routes'));


dbo.connectToServer(function (err) {
  if (err) {
    console.error(err);
    process.exit();
  }

  // start the Express server
  app.listen(PORT, () => {
    console.log('Your app is listening on port ' + PORT)
  })
});
