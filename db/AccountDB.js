const _ = require('lodash')

const COLLECTION_NAME = 'accounts'

class AccountDB {
  constructor (mongodb, ObjectID) {
    this.db = mongodb
    this.ObjectID = ObjectID
  }

  create (account) {
    return this.db.collection(COLLECTION_NAME).save(account)
  }

  find (id) {
    const query = this._buildQuery(id)

    return new Promise((resolve, reject) => {
      this.db.collection(COLLECTION_NAME)
        .find(query)
        .toArray()
        .then(accounts => {
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

    if (query._id) return this.db.collection(COLLECTION_NAME).deleteOne(query)

    return this.db.collection(COLLECTION_NAME).deleteMany(query)
  }

  update ({ id, account }) {
    const query = this._buildQuery(id)

    return this.db.collection(COLLECTION_NAME).replaceOne(query, account)
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
