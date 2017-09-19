const _ = require('lodash')

class AccountDB {
  constructor (AccountModel, ObjectID) {
    this.AccountModel = AccountModel
    this.ObjectID = ObjectID
  }

  create (account) {
    const Account = new this.AccountModel({ name: account.name, balance: account.balance })

    return Account.save()
  }

  find (id) {
    const query = this._buildQuery(id)

    return new Promise((resolve, reject) => {
      this.AccountModel.find(query).exec().then(accounts => {
        this._replaceIDs(accounts)

        resolve(accounts)
      })
      .catch(error => {
        reject(error)
      })
    })
  }

  delete (id) {
    const query = this._buildQuery(id)

    return this.AccountModel.remove(query).exec()
  }

  update ({ id, account }) {
    const query = this._buildQuery(id)

    return this.AccountModel.updateOne(query, account).exec()
  }

  _buildQuery (id) {
    let query = {}

    if (id) query = { _id: this.ObjectID(id) }

    return query
  }

  _replaceIDs (accounts) {
    _.each(accounts, (account) => {
      this._replaceID(account)
    })
  }

  _replaceID (account) {
    account.id = account._id
    delete account['_id']
  }
}

module.exports = AccountDB
