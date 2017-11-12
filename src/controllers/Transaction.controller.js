const BaseController = require('./Base.controller')

class TransactionController extends BaseController {
  constructor (db, logger) {
    super(logger)
    this.db = db
  }

  createTransaction (request, response) {
    this.logInfo('creating transaction')

    this.db.create(request.body)
      .then(result => {
        return response.status(201).send(result)
      })
      .catch(error => {
        this.logFailedToCreateResource('transaction', error)

        if (error.name === 'ValidationError') {
          let keys = Object.keys(error.errors)

          let firstError = error.errors[keys[0]]

          return response.status(400).send({ message: `Validation failed for ${firstError.path} field. Check the value and try again.` })
        }

        return response.status(500).send(error.messsage)
      })
  }

  getTransactions (request, response) {
    this.logInfo('getting transactions')

    this.db.find()
      .then(transactions => {
        return response.status(200).send(transactions)
      })
      .catch(error => {
        this.logFailedToGetResource('transactions', error)
        return response.status(500).send(error)
      })
  }

  getTransaction (request, response) {
    this.logInfo(`getting transaction: ${request.params.id}`)

    this.db.find(request.params.id)
      .then(transactions => {
        if (transactions.length === 0) {
          this.logFailedToGetResource('transaction', 'NOT FOUND')
          return response.status(404).send({})
        }

        return response.status(200).send(transactions[0])
      })
      .catch(error => {
        this.logFailedToGetResource('transaction', error)
        return response.status(500).send(error)
      })
  }

  deleteTransaction (request, response) {
    this.logWarn(`deleting transaction: ${request.params.id}`)

    this.db.delete(request.params.id)
      .then(CommandResult => {
        return this.handleDeleteResult(CommandResult, response, 'transaction')
      })
      .catch(error => {
        this.logFailedToDeleteResource('transaction', error)
        return response.status(500).send(error)
      })
  }

  deleteTransactions (request, response) {
    this.logWarn('deleting transactions')

    this.db.delete()
      .then(result => {
        return response.status(204).send({})
      })
      .catch(error => {
        this.logFailedToDeleteResource('transactions', error)
        return response.status(500).send(error)
      })
  }

  updateTransaction (request, response) {
    this.logInfo(`updating transaction: ${request.params.id}`)

    this.db.update({ id: request.params.id, transaction: request.body })
      .then(result => {
        return this.handleUpdateResult(result, response, 'transaction')
      })
      .catch(error => {
        this.logFailedToUpdateResource('transaction', error)
        return response.status(500).send(error)
      })
  }
}

module.exports = TransactionController
