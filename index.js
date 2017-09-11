const MongoClient = require('mongodb').MongoClient
const uri = 'mongodb://moneytracker:moneytracker@moneytracker-shard-00-00-hkrrr.mongodb.net:27017,moneytracker-shard-00-01-hkrrr.mongodb.net:27017,moneytracker-shard-00-02-hkrrr.mongodb.net:27017/test?ssl=true&replicaSet=MoneyTracker-shard-0&authSource=admin'
const server = require('./server')

MongoClient.connect(uri, (err, database) => {
  if (err) return console.error(`SERVER ERROR ${err}`)

  server.setupServer(database)
})
