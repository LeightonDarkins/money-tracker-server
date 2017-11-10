// const AccountService = require('../services/Account/Account.service')
const BaseController = require('./Base.controller')

class AccountController extends BaseController {
  constructor (AccountService, logger) {
    super(logger)

    this.AccountService = AccountService
  }

  createAccount (request, response) {
    this.logInfo('creating account')

    return this.AccountService.createAccountWithInitialBalance(request.body)
      .then(result => {
        return response.sendStatus(201)
      })
      .catch(error => {
        this.logFailedToCreateResource('account', error)
        return response.status(500).send(error.message)
      })
  }

  getAccounts (request, response) {
    this.logInfo('getting accounts')

    return this.AccountService.getAccounts()
      .then((accounts) => {
        return response.status(200).send(accounts)
      })
      .catch((error) => {
        this.logFailedToGetResource('accounts', error)
        return response.status(500).send(error.message)
      })
  }

  getAccount (request, response) {
    this.logInfo(`getting account: ${request.params.id}`)

    return this.AccountService.getAccountWithBalance(request.params.id)
      .then(account => {
        return response.status(200).send(account)
      })
      .catch(error => {
        this.logFailedToGetResource('account', error)

        switch (error.message) {
          case 'NOT FOUND':
            return response.sendStatus(404)
          default:
            return response.status(500).send(error.message)
        }
      })
  }

  deleteAccount (request, response) {
    this.logWarn(`deleting account: ${request.params.id}`)

    return this.AccountService.deleteAccount(request.params.id)
      .then(CommandResult => {
        return this.handleDeleteResult(CommandResult, response, 'account', this.logger)
      })
      .catch(error => {
        this.logFailedToDeleteResource('account', error)
        return response.status(500).send(error.message)
      })
  }

  deleteAccounts (request, response) {
    this.logWarn('deleting accounts')

    return this.AccountService.deleteAccounts()
      .then(result => {
        return response.sendStatus(204)
      })
      .catch(error => {
        this.logFailedToDeleteResource('accounts', error)
        return response.status(500).send(error.message)
      })
  }

  updateAccount (request, response) {
    this.logInfo(`updating account: ${request.params.id}`)

    return this.AccountService.updateAccount(request.params.id, request.body)
      .then(result => {
        return this.handleUpdateResult(result, response, 'account', this.logger)
      })
      .catch(error => {
        this.logFailedToUpdateResource('account', error)
        return response.status(500).send(error)
      })
  }

  getBalance (request, response) {
    this.logInfo(`getting balance for account: ${request.params.id}`)

    return this.AccountService.getAccountBalance(request.params.id)
      .then(balance => {
        return response.status(200).send({ balance })
      })
      .catch(error => {
        this.logFailedToGetResource('balance for account', error)
        return response.status(500).send(error.message)
      })
  }

  getTransactions (request, response) {
    if (!request.params || !request.params.id) return response.status(400).send('NO_ACCOUNT_ID_PROVIDED')

    this.logInfo(`getting transactions for account: ${request.params.id}`)

    return this.AccountService.getTransactionsForAccount(request.params.id)
      .then(transactions => {
        if (transactions.length < 1) return response.sendStatus(404)

        return response.status(200).send(transactions)
      })
      .catch(error => {
        this.logFailedToGetResource('transactions for account', error)
        return response.status(500).send(error.message)
      })
  }
}

module.exports = AccountController
