/* global describe, it, expect, beforeEach, afterEach, jest */

const BaseController = require('./Base.controller')
let mockResponse, controllerUnderTest, mockLogger

describe('BaseController', () => {
  beforeEach(() => {
    mockLogger = {
      error: jest.fn()
    }

    mockResponse = {
      status: jest.fn(),
      sendStatus: jest.fn()
    }

    mockResponse.status.mockReturnValue({
      send: jest.fn()
    })

    controllerUnderTest = new BaseController(mockLogger)
  })

  afterEach(() => {
    mockLogger.error.mockReset()
    mockResponse.status.mockReset()
    mockResponse.status.mockReset()
    mockResponse.sendStatus.mockReset()
  })

  describe('handleUpdateResult', () => {
    it('returns 404 when no records were modified', () => {
      const mockResult = { nModified: 0 }

      controllerUnderTest.handleUpdateResult(mockResult, mockResponse, 'test')

      expect(mockResponse.sendStatus).toBeCalledWith(404)

      expect(mockLogger.error).toBeCalledWith('BaseController failed to update test. Error: NOT FOUND')
    })

    it('returns 200 when one record was modified', () => {
      const mockResult = { nModified: 1 }

      controllerUnderTest.handleUpdateResult(mockResult, mockResponse, 'test')

      expect(mockResponse.status).toBeCalledWith(200)
      expect(mockResponse.status().send).toBeCalledWith({})
    })

    it('returns 500 when the result is not correctly formed', () => {
      const mockResult = {}

      controllerUnderTest.handleUpdateResult(mockResult, mockResponse, 'test')

      expect(mockResponse.sendStatus).toBeCalledWith(500)

      expect(mockLogger.error).toBeCalledWith('BaseController failed to update test. Error: nModified undefined')
    })
  })

  describe('handleDeleteResult', () => {
    it('returns 404 when no records were deleted', () => {
      const mockCommandResult = { result: { n: 0 } }

      controllerUnderTest.handleDeleteResult(mockCommandResult, mockResponse, 'test')

      expect(mockResponse.sendStatus).toBeCalledWith(404)

      expect(mockLogger.error).toBeCalledWith('BaseController failed to delete test. Error: NOT FOUND')
    })

    it('returns 204 when one record was deleted', () => {
      const mockCommandResult = { result: { n: 1 } }

      controllerUnderTest.handleDeleteResult(mockCommandResult, mockResponse, 'test')

      expect(mockResponse.status).toBeCalledWith(204)
      expect(mockResponse.status().send).toBeCalledWith({})
    })

    it('returns 500 when the CommandResult is not correctly formed', () => {
      const mockCommandResult = { result: {} }

      controllerUnderTest.handleDeleteResult(mockCommandResult, mockResponse, 'test')

      expect(mockResponse.sendStatus).toBeCalledWith(500)

      expect(mockLogger.error).toBeCalledWith('BaseController failed to delete test. Error: n undefined')
    })

    it('returns 500 when the CommandResult is not correctly formed', () => {
      const mockCommandResult = {}

      controllerUnderTest.handleDeleteResult(mockCommandResult, mockResponse, 'test')

      expect(mockResponse.sendStatus).toBeCalledWith(500)

      expect(mockLogger.error).toBeCalledWith('BaseController failed to delete test. Error: result undefined')
    })
  })
})
