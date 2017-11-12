const _ = require('lodash')

class TransactionDB {
  constructor (TransactionModel, ObjectID) {
    this.TransactionModel = TransactionModel
    this.ObjectID = ObjectID
  }

  create ({ amount, category, account, date }) {
    const Transaction = new this.TransactionModel({ amount, category, account, date })

    return Transaction.save()
  }

  find (id) {
    const query = this._buildQuery(id)

    return new Promise((resolve, reject) => {
      this.TransactionModel.find(query).exec().then(transactions => {
        this._replaceIDs(transactions)

        resolve(transactions)
      })
      .catch(error => reject(error))
    })
  }

  findByAccountId (query) {
    return new Promise((resolve, reject) => {
      return this.TransactionModel.find(query).exec()
        .then(transactions => {
          this._replaceIDs(transactions)

          resolve(transactions)
        })
        .catch(error => reject(error))
    })
  }

  delete (id) {
    const query = this._buildQuery(id)

    return this.TransactionModel.remove(query).exec()
  }

  update ({ id, transaction }) {
    const query = this._buildQuery(id)

    return this.TransactionModel.updateOne(query, transaction).exec()
  }

  _buildQuery (id) {
    let query = {}

    if (id) query = { _id: this.ObjectID(id) }

    return query
  }

  _replaceIDs (transactions) {
    _.each(transactions, (transaction) => {
      this._replaceID(transaction)
    })
  }

  _replaceID (transaction) {
    transaction.id = transaction._id
  }
}

module.exports = TransactionDB
