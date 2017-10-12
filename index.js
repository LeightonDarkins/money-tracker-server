const logger = require('./config/logger')
const mongoose = require('mongoose')
const uri = 'mongodb://moneytracker:moneytracker@moneytracker-shard-00-00-hkrrr.mongodb.net:27017,moneytracker-shard-00-01-hkrrr.mongodb.net:27017,moneytracker-shard-00-02-hkrrr.mongodb.net:27017/test?ssl=true&replicaSet=MoneyTracker-shard-0&authSource=admin'
const server = require('./server')

mongoose.Promise = global.Promise

logger.info('connecting to DB...')
mongoose.connect(uri, { useMongoClient: true })
  .then(db => {
    logger.info(`connected!`)

    server.setupServer(logger)
  })
  .catch(error => {
    logger.error(`DB connection error: ${error}`)
  })
