/* eslint-env jest */

const sinon = require('sinon')

const CategoryController = require('./Category.controller')

class MockValidationError {
  constructor (errors, name = 'ValidationError') {
    this.errors = errors
    this.name = name
  }
}

describe('CategoryController', () => {
  const noOp = (y) => y

  let categoryController

  let mockLogger, mockCategoryDB, mockResponse, mockSend
  let mockRequest
  let mockError

  beforeEach(() => {
    mockLogger = {
      info: noOp,
      error: noOp,
      warn: noOp
    }

    mockCategoryDB = {
      create: noOp,
      find: noOp,
      delete: noOp,
      update: noOp
    }

    mockResponse = {
      status: noOp,
      sendStatus: noOp
    }

    mockSend = {
      send: noOp
    }

    mockRequest = {
      params: {
        id: 'category-1'
      },
      body: {}
    }

    mockError = new Error('error')

    sinon.stub(mockResponse, 'status').returns(mockSend)
    sinon.spy(mockSend, 'send')
    sinon.spy(mockResponse, 'sendStatus')

    categoryController = new CategoryController(mockCategoryDB, mockLogger)
  })

  afterEach(() => {
    mockResponse.status.restore()
    mockSend.send.restore()
    mockResponse.sendStatus.restore()
  })

  describe('createCategory', () => {
    it('returns an empty 201 when successful', done => {
      sinon.stub(mockCategoryDB, 'create').returns(Promise.resolve({}))

      categoryController.createCategory({}, mockResponse)
        .then(() => {
          expect(mockResponse.sendStatus).to.have.been.calledWith(201)

          mockCategoryDB.create.restore()

          done()
        })
    })

    it('returns a 400 when a ValidationError occurs', done => {
      sinon.stub(mockCategoryDB, 'create').returns(Promise.reject(new MockValidationError('errors')))

      categoryController.createCategory({}, mockResponse)
        .then(() => {
          expect(mockResponse.status).to.have.been.calledWith(400)
          expect(mockResponse.status().send).to.have.been.calledWith('errors')

          mockCategoryDB.create.restore()

          done()
        })
    })

    it('returns a 500 when a general Error occurs', done => {
      sinon.stub(mockCategoryDB, 'create').returns(Promise.reject(mockError))

      categoryController.createCategory({}, mockResponse)
        .then(() => {
          expect(mockResponse.status).to.have.been.calledWith(500)
          expect(mockResponse.status().send).to.have.been.calledWith('error')

          mockCategoryDB.create.restore()

          done()
        })
    })
  })

  describe('getCategories', () => {
    it('returns a populated 200 when successful', done => {
      sinon.stub(mockCategoryDB, 'find').returns(Promise.resolve('categories'))

      categoryController.getCategories({}, mockResponse)
        .then(() => {
          expect(mockResponse.status).to.have.been.calledWith(200)
          expect(mockResponse.status().send).to.have.been.calledWith('categories')

          mockCategoryDB.find.restore()

          done()
        })
    })

    it('returns a 500 when a general error occurs', done => {
      sinon.stub(mockCategoryDB, 'find').returns(Promise.reject(mockError))

      categoryController.getCategories({}, mockResponse)
        .then(() => {
          expect(mockResponse.status).to.have.been.calledWith(500)
          expect(mockResponse.status().send).to.have.been.calledWith('error')

          mockCategoryDB.find.restore()

          done()
        })
    })
  })

  describe('getCategory', () => {
    let categories = [
      {
        id: 'category-id'
      }
    ]

    it('returns a populated 200 when successful', done => {
      sinon.stub(mockCategoryDB, 'find').returns(Promise.resolve(categories))

      categoryController.getCategory(mockRequest, mockResponse)
        .then(() => {
          expect(mockResponse.status).to.have.been.calledWith(200)
          expect(mockResponse.status().send).to.have.been.calledWith(categories[0])

          mockCategoryDB.find.restore()

          done()
        })
    })

    it('returns a 404 when no accounts are found', done => {
      sinon.stub(mockCategoryDB, 'find').returns(Promise.resolve([]))

      categoryController.getCategory(mockRequest, mockResponse)
        .then(() => {
          expect(mockResponse.sendStatus).to.have.been.calledWith(404)

          mockCategoryDB.find.restore()

          done()
        })
    })

    it('returns a 500 when a general error occurs', done => {
      sinon.stub(mockCategoryDB, 'find').returns(Promise.reject(mockError))

      categoryController.getCategory(mockRequest, mockResponse)
        .then(() => {
          expect(mockResponse.status).to.have.been.calledWith(500)
          expect(mockResponse.status().send).to.have.been.calledWith('error')

          mockCategoryDB.find.restore()

          done()
        })
    })
  })

  describe('deleteCategory', () => {
    it('returns a 500 when the delete result is invalid', done => {
      const mockCommandResult = {
        result: undefined
      }

      sinon.stub(mockCategoryDB, 'delete').returns(Promise.resolve(mockCommandResult))

      categoryController.deleteCategory(mockRequest, mockResponse)
        .then(() => {
          expect(mockResponse.sendStatus).to.have.been.calledWith(500)

          mockCategoryDB.delete.restore()

          done()
        })
    })

    it('returns a 500 when a general error occurs', done => {
      sinon.stub(mockCategoryDB, 'delete').returns(Promise.reject(mockError))

      categoryController.deleteCategory(mockRequest, mockResponse)
        .then(() => {
          expect(mockResponse.status).to.have.been.calledWith(500)
          expect(mockResponse.status().send).to.have.been.calledWith('error')

          mockCategoryDB.delete.restore()

          done()
        })
    })

    it('returns a 404 when no records are deleted', done => {
      const mockCommandResult = {
        result: {
          n: 0
        }
      }

      sinon.stub(mockCategoryDB, 'delete').returns(Promise.resolve(mockCommandResult))

      categoryController.deleteCategory(mockRequest, mockResponse)
        .then(() => {
          expect(mockResponse.sendStatus).to.have.been.calledWith(404)

          mockCategoryDB.delete.restore()

          done()
        })
    })

    it('returns a 200 when a record is deleted', done => {
      const mockCommandResult = {
        result: {
          n: 1
        }
      }

      sinon.stub(mockCategoryDB, 'delete').returns(Promise.resolve(mockCommandResult))

      categoryController.deleteCategory(mockRequest, mockResponse)
        .then(() => {
          expect(mockResponse.status).to.have.been.calledWith(204)

          mockCategoryDB.delete.restore()

          done()
        })
    })
  })

  describe('deleteCategories', () => {
    it('returns a 204 when successful', done => {
      sinon.stub(mockCategoryDB, 'delete').returns(Promise.resolve())

      categoryController.deleteCategories({}, mockResponse)
        .then(() => {
          expect(mockResponse.sendStatus).to.have.been.calledWith(204)

          mockCategoryDB.delete.restore()

          done()
        })
    })

    it('returns a 500 when a general error occurs', done => {
      sinon.stub(mockCategoryDB, 'delete').returns(Promise.reject(mockError))

      categoryController.deleteCategories({}, mockResponse)
        .then(() => {
          expect(mockResponse.status).to.have.been.calledWith(500)
          expect(mockResponse.status().send).to.have.been.calledWith('error')

          mockCategoryDB.delete.restore()

          done()
        })
    })
  })

  describe('updateCategory', () => {
    it('returns a 500 when the response is invalid', done => {
      const mockResult = {
        nModified: undefined
      }

      sinon.stub(mockCategoryDB, 'update').returns(Promise.resolve(mockResult))

      categoryController.updateCategory(mockRequest, mockResponse)
        .then(() => {
          expect(mockResponse.sendStatus).to.have.been.calledWith(500)

          mockCategoryDB.update.restore()

          done()
        })
    })

    it('returns a 500 when a general error occurs', done => {
      sinon.stub(mockCategoryDB, 'update').returns(Promise.reject(mockError))

      categoryController.updateCategory(mockRequest, mockResponse)
        .then(() => {
          expect(mockResponse.status).to.have.been.calledWith(500)
          expect(mockResponse.status().send).to.have.been.calledWith('error')

          mockCategoryDB.update.restore()

          done()
        })
    })

    it('returns a 404 when no records are modified', done => {
      const mockResult = {
        nModified: 0
      }

      sinon.stub(mockCategoryDB, 'update').returns(Promise.resolve(mockResult))

      categoryController.updateCategory(mockRequest, mockResponse)
        .then(() => {
          expect(mockResponse.sendStatus).to.have.been.calledWith(404)

          mockCategoryDB.update.restore()

          done()
        })
    })

    it('returns a 204 when successful', done => {
      const mockResult = {
        nModified: 1
      }

      sinon.stub(mockCategoryDB, 'update').returns(Promise.resolve(mockResult))

      categoryController.updateCategory(mockRequest, mockResponse)
        .then(() => {
          expect(mockResponse.sendStatus).to.have.been.calledWith(200)

          mockCategoryDB.update.restore()

          done()
        })
    })
  })
})
