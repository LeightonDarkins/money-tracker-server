require('./config/node-config')

const express = require('express')
const bodyParser = require('body-parser')
const ObjectID = require('mongodb').ObjectID
const port = process.env.PORT

const AccountDB = require('./db/Account/Account.db')
const AccountModel = require('./models/Account/Account.model')
const AccountController = require('./controllers/Account.controller')
const AccountRouter = require('./routers/Account.router')
const AccountService = require('./services/Account/Account.service')

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

    let accountDB = new AccountDB(AccountModel, ObjectID)
    let transactionDB = new TransactionDB(TransactionModel, ObjectID)
    let categoryDB = new CategoryDB(CategoryModel, ObjectID)
    let accountService = new AccountService(logger, accountDB, transactionDB, Date)

    let accountRouter = new AccountRouter(new AccountController(accountService, logger))
    accountRouter.setupRoutes(app)

    let categoryRouter = new CategoryRouter(new CategoryController(categoryDB, logger))
    categoryRouter.setupRoutes(app)

    let transactionRouter = new TransactionRouter(new TransactionController(transactionDB, logger))
    transactionRouter.setupRoutes(app)

    app.listen(port, () => { logger.info(`started on ${port}`) })
  }
}
