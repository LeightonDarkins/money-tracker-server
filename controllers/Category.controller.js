class CategoryController {
  constructor (db, logger) {
    this.db = db
    this.logger = logger
  }

  createCategory (request, response) {
    this.logger('creating category')

    this.db.create(request.body)
      .then(result => {
        return response.status(201).send(result)
      })
      .catch(error => {
        if (error.name === 'ValidationError') return response.status(400).send(error.errors)

        return response.status(500).send(error)
      })
  }

  getCategories (request, response) {
    this.logger('getting categories')

    this.db.find()
      .then(categories => {
        return response.status(200).send(categories)
      })
      .catch(error => {
        return response.status(500).send(error)
      })
  }

  getCategory (request, response) {
    this.logger(`getting category: ${request.params.id}`)

    this.db.find(request.params.id)
      .then(categories => {
        if (categories.length === 0) return response.status(404).send({})

        return response.status(200).send(categories[0])
      })
      .catch(error => {
        return response.status(500).send(error)
      })
  }

  deleteCategory (request, response) {
    this.logger(`deleting category: ${request.params.id}`)

    this.db.delete(request.params.id)
      .then(result => {
        if (result.deletedCount === 0) return response.status(404).send({})

        return response.status(204).send({})
      })
      .catch(error => {
        return response.status(500).send(error)
      })
  }

  deleteCategories (request, response) {
    this.logger('deleting categories')

    this.db.delete()
      .then(result => {
        return response.status(204).send({})
      })
      .catch(error => {
        return response.status(500).send(error)
      })
  }

  updateCategory (request, response) {
    this.logger(`updating category: ${request.params.id}`)

    this.db.update({ id: request.params.id, category: request.body})
      .then(result => {
        if (result.modifiedCount === 0) return response.status(404).send({})

        return response.status(200).send(result)
      })
      .catch(error => {
        return response.status(500).send(error)
      })
  }
}

module.exports = CategoryController
