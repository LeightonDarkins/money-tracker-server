const AccountService = require('../services/Account/Account.service')
const BaseController = require('./Base.controller')

class AccountController extends BaseController {
  constructor (AccountDB, TransactionDB, logger) {
    super(logger)

    this.AccountDB = AccountDB
    this.TransactionDB = TransactionDB
    this.AccountService = new AccountService(this.logger, this.AccountDB, this.TransactionDB, Date)
  }

  createAccount (request, response) {
    this.logInfo('creating account')

    this.AccountService.createAccountWithInitialBalance(request.body)
      .then(result => {
        return response.sendStatus(201)
      })
      .catch(error => {
        this.logFailedToCreateResource('account', error)
        return response.status(500).send(error)
      })
  }

  getAccounts (request, response) {
    this.logInfo('getting accounts')

    this.AccountService.getAccounts()
      .then((accounts) => {
        return response.status(200).send(accounts)
      })
      .catch((error) => {
        this.logFailedToGetResource('accounts', error)
        return response.status(500).send(error)
      })
  }

  getAccount (request, response) {
    this.logInfo(`getting account: ${request.params.id}`)

    this.AccountDB.find(request.params.id)
      .then(accounts => {
        if (accounts.length === 0) {
          this.logFailedToGetResource('account', 'NOT FOUND')
          return response.status(404).send({})
        }

        let account = accounts[0]

        this.AccountService.getAccountBalance(account._id)
          .then(balance => {
            account.balance = balance

            return response.status(200).send(account)
          })
      })
      .catch(error => {
        this.logFailedToGetResource('account', error)
        return response.status(500).send(error)
      })
  }

  deleteAccount (request, response) {
    this.logWarn(`deleting account: ${request.params.id}`)

    this.AccountDB.delete(request.params.id)
      .then(CommandResult => {
        return this.handleDeleteResult(CommandResult, response, 'account', this.logger)
      })
      .catch(error => {
        this.logFailedToDeleteResource('account', error)
        return response.status(500).send(error)
      })
  }

  deleteAccounts (request, response) {
    this.logWarn('deleting accounts')

    this.AccountDB.delete()
      .then(result => {
        return response.status(204).send({})
      })
      .catch(error => {
        this.logFailedToDeleteResource('accounts', error)
        return response.status(500).send(error)
      })
  }

  updateAccount (request, response) {
    this.logInfo(`updating account: ${request.params.id}`)

    this.AccountDB.update({ id: request.params.id, account: request.body })
      .then(result => {
        return this.handleUpdateResult(result, response, 'accou', this.logger)
      })
      .catch(error => {
        this.logFailedToUpdateResource('account', error)
        return response.status(500).send(error)
      })
  }

  getBalance (request, response) {
    this.logInfo(`getting balance for account: ${request.params.id}`)

    this.AccountService.getAccountBalance(request.params.id)
      .then(balance => {
        return response.status(200).send({ balance })
      })
      .catch(error => {
        this.logFailedToGetResource('balance for account', error)
        return response.status(500).send(error)
      })
  }
}

module.exports = AccountController
