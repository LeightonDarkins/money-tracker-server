/* global describe, it, expect, beforeEach, afterEach */

const sinon = require('sinon')

const AccountController = require('./Account.controller')

describe('AccountController', () => {
  const noOp = (y) => y

  let accountController, mockLogger, mockAccountService, mockResponse, mockSend
  let mockRequest
  let mockError

  beforeEach(() => {
    mockLogger = {
      info: noOp,
      error: noOp,
      warn: noOp
    }

    mockAccountService = {
      getAccountWithBalance: noOp,
      createAccountWithInitialBalance: noOp,
      getAccounts: noOp,
      deleteAccount: noOp,
      deleteAccounts: noOp,
      updateAccount: noOp,
      getAccountBalance: noOp
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
        id: 'account-1'
      },
      body: {}
    }

    mockError = new Error('error')

    sinon.stub(mockResponse, 'status').returns(mockSend)
    sinon.spy(mockSend, 'send')
    sinon.spy(mockResponse, 'sendStatus')

    accountController = new AccountController(mockAccountService, mockLogger)
  })

  afterEach(() => {
    mockResponse.status.restore()
    mockSend.send.restore()
    mockResponse.sendStatus.restore()
  })

  describe('createAccount', () => {
    it('returns an empty 201 when successful', (done) => {
      sinon.stub(mockAccountService, 'createAccountWithInitialBalance').returns(Promise.resolve({}))

      accountController.createAccount({}, mockResponse)
        .then(() => {
          expect(mockAccountService.createAccountWithInitialBalance).to.have.been.calledOnce()
          expect(mockResponse.sendStatus).to.have.been.calledWith(201)

          mockAccountService.createAccountWithInitialBalance.restore()

          done()
        })
    })

    it('returns a 500 error when unsuccessful', (done) => {
      sinon.stub(mockAccountService, 'createAccountWithInitialBalance').returns(Promise.reject(mockError))

      accountController.createAccount({}, mockResponse)
        .then(() => {
          expect(mockAccountService.createAccountWithInitialBalance).to.have.been.calledOnce()
          expect(mockResponse.status).to.have.been.calledWith(500)
          expect(mockResponse.status().send).to.have.been.calledWith(mockError.message)

          mockAccountService.createAccountWithInitialBalance.restore()

          done()
        })
    })
  })

  describe('getAccounts', () => {
    it('returns a 200 when successful', (done) => {
      let accounts = [
        'account-1',
        'account-2'
      ]

      sinon.stub(mockAccountService, 'getAccounts').returns(Promise.resolve(accounts))

      accountController.getAccounts({}, mockResponse)
        .then(() => {
          expect(mockAccountService.getAccounts).to.have.been.calledOnce()
          expect(mockResponse.status).to.have.been.calledWith(200)
          expect(mockResponse.status().send).to.have.been.calledWith(accounts)

          mockAccountService.getAccounts.restore()

          done()
        })
    })

    it('returns a 500 when unsuccessful', (done) => {
      sinon.stub(mockAccountService, 'getAccounts').returns(Promise.reject(mockError))

      accountController.getAccounts({}, mockResponse)
        .then(() => {
          expect(mockAccountService.getAccounts).to.have.been.calledOnce()
          expect(mockResponse.status).to.have.been.calledWith(500)
          expect(mockResponse.status().send).to.have.been.calledWith(mockError.message)

          mockAccountService.getAccounts.restore()

          done()
        })
    })
  })

  describe('getAccount', () => {
    it('returns a 404 when no account is found', (done) => {
      sinon.stub(mockAccountService, 'getAccountWithBalance').returns(Promise.reject(new Error('NOT FOUND')))

      accountController.getAccount(mockRequest, mockResponse)
        .then(() => {
          expect(mockAccountService.getAccountWithBalance).to.have.been.calledWith(mockRequest.params.id)
          expect(mockResponse.sendStatus).to.have.been.calledWith(404)

          mockAccountService.getAccountWithBalance.restore()

          done()
        })
    })

    it('returns a 500 when unsuccessful', (done) => {
      sinon.stub(mockAccountService, 'getAccountWithBalance').returns(Promise.reject(mockError))

      accountController.getAccount(mockRequest, mockResponse)
        .then(() => {
          expect(mockAccountService.getAccountWithBalance).to.have.been.calledWith(mockRequest.params.id)
          expect(mockResponse.status).to.have.been.calledWith(500)
          expect(mockResponse.status().send).to.have.been.calledWith(mockError.message)

          mockAccountService.getAccountWithBalance.restore()

          done()
        })
    })

    it('returns a 200 when successful', (done) => {
      const account = {
        _id: 'account-1',
        balance: 0
      }

      sinon.stub(mockAccountService, 'getAccountWithBalance').returns(Promise.resolve(account))

      accountController.getAccount(mockRequest, mockResponse)
        .then(() => {
          expect(mockAccountService.getAccountWithBalance).to.have.been.calledWith(mockRequest.params.id)
          expect(mockResponse.status).to.have.been.calledWith(200)
          expect(mockResponse.status().send).to.have.been.calledWith(account)

          mockAccountService.getAccountWithBalance.restore()

          done()
        })
    })
  })

  describe('deleteAccount', () => {
    it('it returns a 500 when the delete account result is invalid', (done) => {
      const mockCommandResult = {
        result: undefined
      }

      sinon.stub(mockAccountService, 'deleteAccount').returns(Promise.resolve(mockCommandResult))

      accountController.deleteAccount(mockRequest, mockResponse)
        .then(() => {
          expect(mockAccountService.deleteAccount).to.have.been.calledWith(mockRequest.params.id)
          expect(mockResponse.sendStatus).to.have.been.calledWith(500)

          mockAccountService.deleteAccount.reset()

          done()
        })
    })

    it('it returns a 500 when an error occurs', (done) => {
      sinon.stub(mockAccountService, 'deleteAccount').returns(Promise.reject(mockError))

      accountController.deleteAccount(mockRequest, mockResponse)
        .then(() => {
          expect(mockResponse.status).to.have.been.calledWith(500)
          expect(mockResponse.status().send).to.have.been.calledWith(mockError.message)

          done()
        })
    })

    it('it returns a 404 when no records are modified', (done) => {
      const mockCommandResult = {
        result: {
          n: 0
        }
      }

      sinon.stub(mockAccountService, 'deleteAccount').returns(Promise.resolve(mockCommandResult))

      accountController.deleteAccount(mockRequest, mockResponse)
        .then(() => {
          expect(mockAccountService.deleteAccount).to.have.been.calledWith('account-1')
          expect(mockResponse.sendStatus).to.have.been.calledWith(404)

          mockAccountService.deleteAccount.reset()

          done()
        })
    })

    it('it returns a 204 when a record is deleted', (done) => {
      const mockCommandResult = {
        result: {
          n: 1
        }
      }

      sinon.stub(mockAccountService, 'deleteAccount').returns(Promise.resolve(mockCommandResult))

      accountController.deleteAccount(mockRequest, mockResponse)
        .then(() => {
          expect(mockAccountService.deleteAccount).to.have.been.calledWith(mockRequest.params.id)
          expect(mockResponse.status).to.have.been.calledWith(204)
          expect(mockResponse.status().send).to.have.been.calledWith({})

          mockAccountService.deleteAccount.reset()

          done()
        })
    })
  })

  describe('deleteAccounts', () => {
    it('returns a 204 when successful', done => {
      sinon.stub(mockAccountService, 'deleteAccounts').returns(Promise.resolve({}))

      accountController.deleteAccounts({}, mockResponse)
        .then(() => {
          expect(mockAccountService.deleteAccounts).to.have.been.calledOnce()
          expect(mockResponse.sendStatus).to.have.been.calledWith(204)

          done()
        })
    })

    it('returns a 500 when an error occurs', done => {
      sinon.stub(mockAccountService, 'deleteAccounts').returns(Promise.reject(mockError))

      accountController.deleteAccounts({}, mockResponse)
        .then(() => {
          expect(mockAccountService.deleteAccounts).to.have.been.calledOnce()
          expect(mockResponse.status).to.have.been.calledWith(500)
          expect(mockResponse.status().send).to.have.been.calledWith(mockError.message)

          done()
        })
    })
  })

  describe('updateAccount', () => {
    it('returns a 500 when service response is invalid', done => {
      const mockResult = {
        nModified: undefined
      }

      sinon.stub(mockAccountService, 'updateAccount').returns(Promise.resolve(mockResult))

      accountController.updateAccount(mockRequest, mockResponse)
        .then(() => {
          expect(mockAccountService.updateAccount).to.have.been.calledOnce()
          expect(mockResponse.sendStatus).to.have.been.calledWith(500)

          mockAccountService.updateAccount.restore()

          done()
        })
    })

    it('returns a 500 when no records are modified', done => {
      const mockResult = {
        nModified: 0
      }

      sinon.stub(mockAccountService, 'updateAccount').returns(Promise.resolve(mockResult))

      accountController.updateAccount(mockRequest, mockResponse)
        .then(() => {
          expect(mockAccountService.updateAccount).to.have.been.calledOnce()
          expect(mockResponse.sendStatus).to.have.been.calledWith(404)

          mockAccountService.updateAccount.restore()

          done()
        })
    })

    it('returns a 200 when successful', done => {
      const mockResult = {
        nModified: 1
      }

      sinon.stub(mockAccountService, 'updateAccount').returns(Promise.resolve(mockResult))

      accountController.updateAccount(mockRequest, mockResponse)
        .then(() => {
          expect(mockAccountService.updateAccount).to.have.been.calledOnce()
          expect(mockResponse.sendStatus).to.have.been.calledWith(200)

          mockAccountService.updateAccount.restore()

          done()
        })
    })
  })

  describe('getBalance', () => {
    it('returns a 200 when successful', done => {
      sinon.stub(mockAccountService, 'getAccountBalance').returns(Promise.resolve(1000))

      accountController.getBalance(mockRequest, mockResponse)
        .then(() => {
          expect(mockResponse.status).to.have.been.calledWith(200)
          expect(mockResponse.status().send).to.have.been.calledWith({ balance: 1000 })

          mockAccountService.getAccountBalance.restore()

          done()
        })
    })

    it('returns a 500 when an error occurs', done => {
      sinon.stub(mockAccountService, 'getAccountBalance').returns(Promise.reject(mockError))

      accountController.getBalance(mockRequest, mockResponse)
        .then(() => {
          expect(mockResponse.status).to.have.been.calledWith(500)
          expect(mockResponse.status().send).to.have.been.calledWith(mockError.message)

          mockAccountService.getAccountBalance.restore()

          done()
        })
    })
  })
})
