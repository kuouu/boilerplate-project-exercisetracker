const express = require('express');
const { ObjectId } = require('mongodb');
const dbo = require('./db');

const recordRoutes = express.Router();

const findUser = (done, userId) => {
  const dbConnect = dbo.getDb();
  dbConnect
    .collection('users')
    .findOne({ _id: new ObjectId(userId) }, (err, result) => {
      if (err) done(err)
      else done(null, result)
    })
}

// Create a New User
recordRoutes.route('/api/users')
  .get((_, res) => {
    console.log('GET /api/users');
    const dbConnect = dbo.getDb();
    dbConnect
      .collection('users')
      .find({})
      .toArray(function (err, result) {
        if (err) {
          res.status(400).send('Error fetching users!');
        } else {
          res.json(result)
        }
      })
  })
  .post((req, res) => {
    console.log('POST /api/users')
    const username = req.body.username
    const dbConnect = dbo.getDb();
    dbConnect
      .collection('users')
      .insertOne({ username: username }, (err, result) => {
        if (err) {
          res.status(400).send('Error creating user!');
        } else {
          res.json({ username: username, _id: result.insertedId })
        }
      })
  })

// Add exercises
recordRoutes.route('/api/users/:_id/exercises')
  .post((req, res) => {
    console.log('POST /api/users/:_id/exercises')
    const userId = req.params._id
    const description = req.body.description
    const duration = Number(req.body.duration)
    if (isNaN(duration)) res.json({ error: 'Duration must be a number' })

    let date
    if (req.body.date === '') date = new Date()
    else {
      date = new Date(req.body.date)
      if (isNaN(date))
        res.json({ error: 'Date must be a valid date' })
    }
    const dbConnect = dbo.getDb();
    date = date.toDateString()
    findUser((err, user) => {
      if (err) {
        user.status(400).send('Error finding user!');
      } else {
        dbConnect
          .collection('exercises')
          .insertOne({
            userId: userId,
            username: user.username,
            description: description,
            duration: duration,
            date: date
          }, (err, result) => {
            if (err) {
              res.status(400).send('Error creating exercise!');
            } else {
              res.json({
                _id: result.insertedId,
                username: user.username,
                description: description,
                duration: duration,
                date: date
              })
            }
          })
      }
    }, userId)
  })

// Get a User's Exercise Log
recordRoutes.route('/api/users/:_id/logs')
  .get((req, res) => {
    console.log('GET /api/users/:_id/logs')
    const userId = req.params._id
    const from = new Date(req.query.from)
    const to = new Date(req.query.to)
    const limit = req.query.limit ? Number(req.query.limit) : 0
    findUser((err, user) => {
      if (err) {
        res.status(400).send('Error finding user!');
      } else {
        const dbConnect = dbo.getDb();
        dbConnect
          .collection('exercises')
          .find({
            userId: userId
          }, {
            date: {
              $gte: from,
              $lte: to
            }
          })
          .limit(limit)
          .toArray(function (err, result) {
            if (err) {
              res.status(400).send('Error fetching exercises!');
            } else {
              res.json({
                _id: userId,
                username: user.username,
                count: result.length,
                log: result
              })
            }
          });
      }
    }, userId)
  })

module.exports = recordRoutes;