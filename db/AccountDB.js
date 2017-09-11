class AccountDB {
  constructor (mongodb, ObjectID) {
    this.db = mongodb
    this.ObjectID = ObjectID
  }

  create (account) {
    return this.db.collection('accounts').save(account)
  }

  find (id) {
    const query = this._buildQuery(id)

    return this.db.collection('accounts').find(query).toArray()
  }

  delete (id) {
    const query = this._buildQuery(id)

    if (query._id) return this.db.collection('accounts').deleteOne(query)

    return this.db.collection('accounts').deleteMany(query)
  }

  update ({ id, account }) {
    const query = this._buildQuery(id)

    return this.db.collection('accounts').replaceOne(query, account)
  }

  _buildQuery (id) {
    let query = {}

    if (id) query = { _id: this.ObjectID(id) }

    return query
  }
}

module.exports = AccountDB
