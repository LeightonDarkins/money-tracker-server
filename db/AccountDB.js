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

    return this.db.collection(COLLECTION_NAME).find(query).toArray()
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
}

module.exports = AccountDB
