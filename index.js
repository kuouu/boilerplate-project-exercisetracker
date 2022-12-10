const app = require('./api')

const PORT = process.env.PORT || 3000;

// start the Express server
app.listen(PORT, () => {
  console.log('Your app is listening on port ' + PORT)
})