require('dotenv').config()
const express = require('express')
const massive = require('massive')
const session = require('express-session')
const authCtrl = require('./controllers/authController')
const authenticateUser = require('./middlewares/authenticateUser')
const {SERVER_PORT, CONNECTION_STRING, SESSION_SECRET} = process.env

const app = express()

app.use(express.json())
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: SESSION_SECRET,
  cookie: { maxAge: 1000 * 60 * 60 * 24 }
  // 1000 milliseconds, 60 seconds, 60 minutes, 24 hours = 1 day; *7 for a week or *30 for a month or *365 for a year
}))

app.post('/auth/register', authCtrl.register)
app.post('/auth/login', authCtrl.login)
app.get('/auth/user', authCtrl.getUserSession)
app.delete('/auth/logout', authCtrl.logout)

//! FOR ADMINS ONLY
app.get('/api/secrets', authenticateUser, (req, res) => {
  res.status(200).send('HERE ARE YOUR SECRETS')
})

massive({
  connectionString: CONNECTION_STRING,
  ssl: {
    rejectUnauthorized: false
  }
}).then(dbInstance => {
  app.set('db', dbInstance)
  console.log('DB Ready')
  app.listen(SERVER_PORT, () =>
    console.log(`Server ready on port ${SERVER_PORT}`))
})