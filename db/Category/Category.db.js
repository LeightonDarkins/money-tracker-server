const _ = require('lodash')

const COLLECTION_NAME = 'categories'

class CategoryDB {
  constructor (CategoryModel, ObjectID) {
    this.CategoryModel = CategoryModel
    this.ObjectID = ObjectID
  }

  create (category) {
    const Category = new this.CategoryModel({ name: category.name })

    return Category.save()
  }

  find (id) {
    const query = this._buildQuery(id)

    return new Promise((resolve, reject) => {
      this.CategoryModel.find(query).exec().then(categories => {
        this._replaceIDs(categories)

        resolve(categories)
      })
      .catch(error => {
        reject(error)
      })
    })
  }

  delete (id) {
    const query = this._buildQuery(id)

    return this.CategoryModel.remove(query).exec()
  }

  update ({ id, category }) {
    const query = this._buildQuery(id)

    return this.CategoryModel.updateOne(query, category).exec()
  }

  _buildQuery (id) {
    let query = {}

    if (id) query = { _id: this.ObjectID(id) }

    return query
  }

  _replaceIDs (categories) {
    _.each(categories, (category) => {
      this._replaceID(category)
    })
  }

  _replaceID (category) {
    category.id = category._id
  }
}

module.exports = CategoryDB
