require('./config/node-config')
const logger = require('./config/logger')
const express = require('express')
const bodyParser = require('body-parser');
const ObjectID = require('mongodb').ObjectID
const port = process.env.PORT

const AccountDB = require('./db/Account.db')
const AccountModel = require('./models/Account.model')
const AccountController = require('./controllers/Account.controller')
const AccountRouter = require('./routers/Account.router')

const CategoryDB = require('./db/Category/Category.db')
const CategoryModel = require('./models/Category/Category.model')
const CategoryController = require('./controllers/Category.controller')
const CategoryRouter = require('./routers/Category.router')

module.exports = {
  setupServer: () => {
    let app = express();

    app.use(bodyParser.json());
    app.use((req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*")
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
      next()
    })

    AccountRouter.setupRoutes(new AccountController(new AccountDB(AccountModel, ObjectID), logger), app)
    CategoryRouter.setupRoutes(new CategoryController(new CategoryDB(CategoryModel, ObjectID), logger), app)

    app.listen(port, () => { logger(`started on ${port}`) })
  }
}
