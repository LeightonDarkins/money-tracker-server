/* global describe, it, expect, beforeEach, afterEach */

const sinon = require('sinon')

const BaseController = require('./Base.controller')
let mockResponse, controllerUnderTest, mockLogger, mockSend

describe('BaseController', () => {
  beforeEach(() => {
    mockLogger = {
      error: (y) => y
    }

    mockResponse = {
      status: (y) => y,
      sendStatus: (y) => y
    }

    mockSend = {
      send: (y) => y
    }

    sinon.spy(mockLogger, 'error')
    sinon.stub(mockResponse, 'status').returns(mockSend)
    sinon.spy(mockSend, 'send')
    sinon.spy(mockResponse, 'sendStatus')

    controllerUnderTest = new BaseController(mockLogger)
  })

  afterEach(() => {
    mockLogger.error.restore()
    mockResponse.status.restore()
    mockResponse.sendStatus.restore()
  })

  describe('handleUpdateResult', () => {
    it('returns 404 when no records were modified', () => {
      const mockResult = { nModified: 0 }

      controllerUnderTest.handleUpdateResult(mockResult, mockResponse, 'test')

      expect(mockResponse.sendStatus).to.have.been.calledWith(404)

      expect(mockLogger.error).to.have.been.calledWith('BaseController failed to update test. Error: NOT FOUND')
    })

    it('returns 200 when one record was modified', () => {
      const mockResult = { nModified: 1 }

      controllerUnderTest.handleUpdateResult(mockResult, mockResponse, 'test')

      expect(mockResponse.status).to.have.been.calledWith(200)
      expect(mockResponse.status().send).to.have.been.calledWith({})
    })

    it('returns 500 when the result is not correctly formed', () => {
      const mockResult = {}

      controllerUnderTest.handleUpdateResult(mockResult, mockResponse, 'test')

      expect(mockResponse.sendStatus).to.have.been.calledWith(500)

      expect(mockLogger.error).to.have.been.calledWith('BaseController failed to update test. Error: nModified undefined')
    })
  })

  describe('handleDeleteResult', () => {
    it('returns 404 when no records were deleted', () => {
      const mockCommandResult = { result: { n: 0 } }

      controllerUnderTest.handleDeleteResult(mockCommandResult, mockResponse, 'test')

      expect(mockResponse.sendStatus).to.have.been.calledWith(404)

      expect(mockLogger.error).to.have.been.calledWith('BaseController failed to delete test. Error: NOT FOUND')
    })

    it('returns 204 when one record was deleted', () => {
      const mockCommandResult = { result: { n: 1 } }

      controllerUnderTest.handleDeleteResult(mockCommandResult, mockResponse, 'test')

      expect(mockResponse.status).to.have.been.calledWith(204)
      expect(mockResponse.status().send).to.have.been.calledWith({})
    })

    it('returns 500 when the CommandResult is not correctly formed', () => {
      const mockCommandResult = { result: {} }

      controllerUnderTest.handleDeleteResult(mockCommandResult, mockResponse, 'test')

      expect(mockResponse.sendStatus).to.have.been.calledWith(500)

      expect(mockLogger.error).to.have.been.calledWith('BaseController failed to delete test. Error: n undefined')
    })

    it('returns 500 when the CommandResult is not correctly formed', () => {
      const mockCommandResult = {}

      controllerUnderTest.handleDeleteResult(mockCommandResult, mockResponse, 'test')

      expect(mockResponse.sendStatus).to.have.been.calledWith(500)

      expect(mockLogger.error).to.have.been.calledWith('BaseController failed to delete test. Error: result undefined')
    })
  })
})
