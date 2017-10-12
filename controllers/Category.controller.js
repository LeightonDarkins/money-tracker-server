const BaseController = require('./Base.controller')

class CategoryController extends BaseController {
  constructor (db, logger) {
    super(logger)

    this.db = db
  }

  createCategory (request, response) {
    this.logInfo('creating category')

    this.db.create(request.body)
      .then(result => {
        return response.status(201).send(result)
      })
      .catch(error => {
        if (error.name === 'ValidationError') {
          this.logFailedToValidateResource('category', error)
          return response.status(400).send(error.errors)
        }

        this.logFailedToCreateResource('category', error)
        return response.status(500).send(error)
      })
  }

  getCategories (request, response) {
    this.logInfo('getting categories')

    this.db.find()
      .then(categories => {
        return response.status(200).send(categories)
      })
      .catch(error => {
        this.logFailedToGetResource('categories', error)
        return response.status(500).send(error)
      })
  }

  getCategory (request, response) {
    this.logInfo(`getting category: ${request.params.id}`)

    this.db.find(request.params.id)
      .then(categories => {
        if (categories.length === 0) {
          this.logFailedToGetResource('categories', 'NOT FOUND')
          return response.status(404).send({})
        }

        return response.status(200).send(categories[0])
      })
      .catch(error => {
        this.logFailedToGetResource('categories', error)
        return response.status(500).send(error)
      })
  }

  deleteCategory (request, response) {
    this.logWarn(`deleting category: ${request.params.id}`)

    this.db.delete(request.params.id)
      .then(CommandResult => {
        return this.handleDeleteResult(CommandResult, response, 'category', this.logger)
      })
      .catch(error => {
        this.logFailedToDeleteResource('category', error)
        return response.status(500).send(error)
      })
  }

  deleteCategories (request, response) {
    this.logWarn('deleting categories')

    this.db.delete()
      .then(result => {
        return response.status(204).send({})
      })
      .catch(error => {
        this.logFailedToDeleteResource('categories', error)
        return response.status(500).send(error)
      })
  }

  updateCategory (request, response) {
    this.logInfo(`updating category: ${request.params.id}`)

    this.db.update({ id: request.params.id, category: request.body })
      .then(result => {
        return this.handleUpdateResult(result, response, 'category', this.logger)
      })
      .catch(error => {
        this.logFailedToUpdateResource('category', error)
        return response.status(500).send(error)
      })
  }
}

module.exports = CategoryController
