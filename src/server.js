require('./config/node-config')

const express = require('express')
const bodyParser = require('body-parser')
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

const TransactionDB = require('./db/Transaction/Transaction.db')
const TransactionModel = require('./models/Transaction/Transaction.model')
const TransactionController = require('./controllers/Transaction.controller')
const TransactionRouter = require('./routers/Transaction.router')

module.exports = {
  setupServer: (logger) => {
    let app = express()

    app.use(bodyParser.json())
    app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*')
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
      next()
    })

    let accountRouter = new AccountRouter(new AccountController(new AccountDB(AccountModel, ObjectID), new TransactionDB(TransactionModel, ObjectID), logger))
    accountRouter.setupRoutes(app)

    // AccountRouter.setupRoutes(new AccountController(new AccountDB(AccountModel, ObjectID), new TransactionDB(TransactionModel, ObjectID), logger), app)
    CategoryRouter.setupRoutes(new CategoryController(new CategoryDB(CategoryModel, ObjectID), logger), app)
    TransactionRouter.setupRoutes(new TransactionController(new TransactionDB(TransactionModel, ObjectID), logger), app)

    app.listen(port, () => { logger.info(`started on ${port}`) })
  }
}
