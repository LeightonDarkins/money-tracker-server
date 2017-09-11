require('./config/node-config')
const logger = require('./config/logger')
const express = require('express')
const bodyParser = require('body-parser');
const ObjectID = require('mongodb').ObjectID
const port = process.env.PORT
const AccountController = require('./controllers/AccountController')
const AccountDB = require('./db/AccountDB')
const AccountRouter = require('./routers/AccountRouter')

module.exports = {
  setupServer: (database) => {
    let app = express();

    app.use(bodyParser.json());
    app.use((req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*")
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
      next()
    })

    AccountRouter.setupRoutes(new AccountController(new AccountDB(database, ObjectID), logger), app)

    app.listen(port, () => { logger(`started on ${port}`) })
  }
}
