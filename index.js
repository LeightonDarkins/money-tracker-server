const mongoose = require('mongoose')
const uri = 'mongodb://moneytracker:moneytracker@moneytracker-shard-00-00-hkrrr.mongodb.net:27017,moneytracker-shard-00-01-hkrrr.mongodb.net:27017,moneytracker-shard-00-02-hkrrr.mongodb.net:27017/test?ssl=true&replicaSet=MoneyTracker-shard-0&authSource=admin'
const server = require('./server')

mongoose.Promise = global.Promise
mongoose.connect(uri)
var db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error'))

db.once('open', () => {
  server.setupServer()
})
