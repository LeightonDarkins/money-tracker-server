class AccountController {
  constructor (AccountDB, TransactionDB, logger) {
    this.AccountDB = AccountDB
    this.TransactionDB = TransactionDB
    this.logger = logger
  }

  createAccount (request, response) {
    this.logger('creating account')

    this.AccountDB.create(request.body)
      .then(account => {
        if (request.body.openingBalance) {
          return this._createInitialTransaction(response, account._id, request.body.openingBalance)
        } else {
          return response.sendStatus(201)
        }
      })
      .catch(error => {
        if (error.name === 'ValidationError') return response.status(400).send(error.errors)

        return response.status(500).send(error)
      })
  }

  getAccounts (request, response) {
    this.logger('getting accounts')

    this.AccountDB.find()
      .then(accounts => {
        return response.status(200).send(accounts)
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

        return response.status(200).send(accounts[0])
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

    this.TransactionDB.findByAccountId({ account: request.params.id }).then(transactions => {
      const balance = transactions.reduce((a, b) => a + b.amount, 0)

      return response.status(200).send({ balance })
    })
    .catch(error => {
      return response.status(500).send(error)
    })
  }

  _createInitialTransaction (response, account, amount) {
    this.logger(`creating initial transaction for account: ${account}`)

    const initialTransaction = {
      amount,
      category: '59dd17f5549f1471ed426c31',
      account: account,
      date: Date.now()
    }

    return this.TransactionDB.create(initialTransaction)
    .then(() => response.sendStatus(201))
    .catch(error => response.status(500).send(error))
  }
}

module.exports = AccountController
