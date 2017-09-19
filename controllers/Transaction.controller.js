class TransactionController {
  constructor (db, logger) {
    this.db = db
    this.logger = logger
  }

  createTransaction (request, response) {
    this.logger('creating transaction')

    console.log(request.body)

    this.db.create(request.body)
      .then(result => {
        return response.status(201).send(result)
      })
      .catch(error => {
        return response.status(500).send(error)
      })
  }

  getTransactions (request, response) {
    this.logger('getting transactions')

    this.db.find()
      .then(transactions => {
        return response.status(200).send(transactions)
      })
      .catch(error => {
        return response.status(500).send(error)
      })
  }

  getTransaction (request, response) {
    this.logger(`getting transaction: ${request.params.id}`)

    this.db.find(request.params.id)
      .then(transactions => {
        if (transactions.length === 0) return response.status(404).send({})

        return response.status(200).send(transactions[0])
      })
      .catch(error => {
        return response.status(500).send(error)
      })
  }

  deleteTransaction (request, response) {
    this.logger(`deleting transaction: ${request.params.id}`)

    this.db.delete(request.params.id)
      .then(result => {
        if (result.deletedCount === 0) return response.status(404).send({})

        return response.status(204).send({})
      })
      .catch(error => {
        return response.status(500).send(error)
      })
  }

  deleteTransactions (request, response) {
    this.logger('deleting transactions')

    this.db.delete()
      .then(result => {
        return response.status(204).send({})
      })
      .catch(error => {
        return response.status(500).send(error)
      })
  }

  updateTransaction (request, response) {
    this.logger(`updating transaction: ${request.params.id}`)

    this.db.update({ id: request.params.id, transaction: request.body})
      .then(result => {
        if (result.modifiedCount === 0) return response.status(404).send({})

        return response.status(200).send(result)
      })
      .catch(error => {
        return response.status(500).send(error)
      })
  }
}

module.exports = TransactionController
