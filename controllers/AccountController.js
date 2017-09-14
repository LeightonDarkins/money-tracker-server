const Account = require('../models/Account')

class AccountController {
  constructor (db, logger) {
    this.db = db
    this.logger = logger
  }

  createAccount (request, response) {
    this.logger('creating account')

    const account = new Account()
      .withName(request.body.name)
      .withBalance(request.body.balance)

    this.db.create(request.body)
      .then(result => {
        return response.status(201).send(result)
      })
      .catch(error => {
        return response.status(500).send(error)
      })
  }

  getAccounts (request, response) {
    this.logger('getting accounts')

    this.db.find()
      .then(accounts => {
        return response.status(200).send(accounts)
      })
      .catch(error => {
        return response.status(500).send(error)
      })
  }

  getAccount (request, response) {
    this.logger(`getting account: ${request.params.id}`)

    this.db.find(request.params.id)
      .then(accounts => {
        if (accounts.length === 0) return response.status(404).send({})

        return response.status(200).send(accounts[0])
      })
      .catch(error => {
        return response.status(500).send(error)
      })
  }

  deleteAccount (request, response) {
    this.logger(`deleting account: ${request.params.id}`)

    this.db.delete(request.params.id)
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

    this.db.delete()
      .then(result => {
        return response.status(204).send({})
      })
      .catch(error => {
        return response.status(500).send(error)
      })
  }

  updateAccount (request, response) {
    this.logger(`updating account: ${request.params.id}`)

    this.db.update({ id: request.params.id, account: request.body})
      .then(result => {
        if (result.modifiedCount === 0) return response.status(404).send({})

        return response.status(200).send(result)
      })
      .catch(error => {
        return response.status(500).send(error)
      })
  }
}

module.exports = AccountController
