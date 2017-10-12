class BaseController {
  constructor (logger) {
    this.logger = logger
  }

  handleUpdateResult (result, response, resource) {
    if (result.nModified === 0) {
      this.logFailedToUpdateResource(resource, 'NOT FOUND')
      return response.status(404).send({})
    }

    return response.status(200).send(result)
  }

  handleDeleteResult (CommandResult, response, resource) {
    if (CommandResult.result.n === 0) {
      this.logFailedToDeleteResource(resource, 'NOT FOUND')
      return response.status(404).send({})
    }

    return response.status(204).send({})
  }

  logInfo (message) {
    this.logger.info(`${this.constructor.name} ${message}`)
  }

  logWarn (message) {
    this.logger.warn(`${this.constructor.name} ${message}`)
  }

  logFailedToUpdateResource (resource, error) {
    this.logger.error(`${this.constructor.name} failed to update ${resource}. Error: ${error}`)
  }

  logFailedToDeleteResource (resource, error) {
    this.logger.error(`${this.constructor.name} failed to delete ${resource}. Error: ${error}`)
  }

  logFailedToGetResource (resource, error) {
    this.logger.error(`${this.constructor.name} failed to get ${resource}. Error: ${error}`)
  }

  logFailedToCreateResource (resource, error) {
    this.logger.error(`${this.constructor.name} failed to create ${resource}. Error: ${error}`)
  }

  logFailedToValidateResource (resource, error) {
    this.logger.error(`${this.constructor.name} failed to validate ${resource}. Error ${error}`)
  }
}

module.exports = BaseController
