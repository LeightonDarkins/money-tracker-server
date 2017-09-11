require('./config/node-config')

const logger = require('./config/logger')
const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser');

const MongoClient = require('mongodb').MongoClient
const ObjectID = require('mongodb').ObjectID

const port = process.env.PORT
const uri = 'mongodb://moneytracker:moneytracker@moneytracker-shard-00-00-hkrrr.mongodb.net:27017,moneytracker-shard-00-01-hkrrr.mongodb.net:27017,moneytracker-shard-00-02-hkrrr.mongodb.net:27017/test?ssl=true&replicaSet=MoneyTracker-shard-0&authSource=admin'

let app = express();
app.use(bodyParser.json());

let db

const AccountController = require('./controllers/AccountController')
const AccountDB = require('./db/AccountDB')
let accountController
let accountDb

// Enabled CORS From Everywhere
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
})

MongoClient.connect(uri, (err, database) => {
  if (err) return console.error(`SERVER ERROR ${err}`)

  db = database

  accountDb = new AccountDB(db, ObjectID)
  accountController = new AccountController(accountDb, logger)

  app.get('/account', (req, res) => accountController.getAccounts(req, res))
  app.delete('/account', (req, res) => accountController.deleteAccounts(req, res))

  app.post('/account', (req, res) => accountController.createAccount(req, res))
  app.get('/account/:id', (req, res) => accountController.getAccount(req, res))
  app.delete('/account/:id', (req, res) => accountController.deleteAccount(req, res))
  app.put('/account/:id', (req, res) => accountController.updateAccount(req, res))

  app.listen(port, () => { logger(`started on ${port}`) })
})

module.exports = { app }
