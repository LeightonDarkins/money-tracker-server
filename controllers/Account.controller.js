const AccountService = require('../services/Account/Account.service')
const _ = require('lodash')

class AccountController {
  constructor (AccountDB, TransactionDB, logger) {
    this.AccountDB = AccountDB
    this.TransactionDB = TransactionDB
    this.logger = logger
    this.AccountService = new AccountService(this.AccountDB, this.TransactionDB)
  }

  createAccount (request, response) {
    this.logger('creating account')

    this.AccountService.createAccountWithInitialBalance(request.body)
      .then(result => {
        return response.sendStatus(201)
      })
      .catch(error => {
        return response.status(500).send(error)
      })
  }

  getAccounts (request, response) {
    this.logger('getting accounts')

    this.AccountDB.find()
      .then(accounts => {
        let promises = []

        _.each(accounts, (account) => {
          promises.push(this.AccountService.getAccountBalance(account._id))
        })

        Promise.all(promises).then(balances => {
          for (let x = 0; x < balances.length; x++) {
            accounts[x].balance = balances[x]
          }

          return response.status(200).send(accounts)
        })
      })
      .catch(error => {
        return response.status(500).send(error)
      })
  }

  getAccount (request, response) {
    this.logger(`getting account: ${request.params.id}`)

    this.AccountDB.find(request.params.id)
      .then(accounts => {
        if (accounts.length === 0) return response.status(404).send({})

        let account = accounts[0]

        this.AccountService.getAccountBalance(account._id)
          .then(balance => {
            account.balance = balance

            return response.status(200).send(account)
          })
      })
      .catch(error => {
        return response.status(500).send(error)
      })
  }

  deleteAccount (request, response) {
    this.logger(`deleting account: ${request.params.id}`)

    this.AccountDB.delete(request.params.id)
      .then(result => {
        if (result.deletedCount === 0) return response.status(404).send({})

        return response.status(204).send({})
      })
      .catch(error => {
        return response.status(500).send(error)
      })
  }

  deleteAccounts (request, response) {
    this.logger('deleting accounts')

    this.AccountDB.delete()
      .then(result => {
        return response.status(204).send({})
      })
      .catch(error => {
        return response.status(500).send(error)
      })
  }

  updateAccount (request, response) {
    this.logger(`updating account: ${request.params.id}`)

    this.AccountDB.update({ id: request.params.id, account: request.body })
      .then(result => {
        if (result.modifiedCount === 0) return response.status(404).send({})

        return response.status(200).send(result)
      })
      .catch(error => {
        return response.status(500).send(error)
      })
  }

  getBalance (request, response) {
    this.logger(`getting balance for account: ${request.params.id}`)

    this.AccountService.getAccountBalance(request.params.id)
      .then(balance => {
        return response.status(200).send({ balance })
      })
      .catch(error => {
        return response.status(500).send(error)
      })
  }
}

module.exports = AccountController
