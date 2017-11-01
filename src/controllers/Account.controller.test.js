/* global describe, it, expect, beforeEach, afterEach */

const sinon = require('sinon')

const AccountController = require('./Account.controller')

describe('AccountController', () => {
  let accountController, mockLogger, mockAccountDB, mockResponse, mockSend

  beforeEach(() => {
    mockLogger = {
      info: (y) => y,
      error: (y) => y
    }

    mockAccountDB = {
      create: (y) => y,
      find: (y) => y
    }

    mockResponse = {
      status: (y) => y,
      sendStatus: (y) => y
    }

    mockSend = {
      send: (y) => y
    }

    sinon.stub(mockResponse, 'status').returns(mockSend)
    sinon.spy(mockSend, 'send')
    sinon.spy(mockResponse, 'sendStatus')

    accountController = new AccountController(mockAccountDB, {}, mockLogger)
  })

  afterEach(() => {
    mockResponse.status.restore()
    mockSend.send.restore()
    mockResponse.sendStatus.restore()
  })

  describe('createAccount', () => {
    it('returns an empty 201 when successful', (done) => {
      sinon.stub(accountController.AccountService, 'createAccountWithInitialBalance').returns(Promise.resolve({}))

      accountController.createAccount({}, mockResponse).then((result) => {
        expect(accountController.AccountService.createAccountWithInitialBalance).to.have.been.calledOnce()
        expect(mockResponse.sendStatus).to.have.been.calledWith(201)
        expect(result).to.equal(201)

        accountController.AccountService.createAccountWithInitialBalance.restore()

        done()
      })
    })

    it('returns a 500 error when unsuccessful', (done) => {
      const errorBody = 'An error'

      sinon.stub(accountController.AccountService, 'createAccountWithInitialBalance').returns(Promise.reject(new Error(errorBody)))

      accountController.createAccount({}, mockResponse).then((result) => {
        expect(accountController.AccountService.createAccountWithInitialBalance).to.have.been.calledOnce()
        expect(mockResponse.status).to.have.been.calledWith(500)
        expect(mockResponse.status().send).to.have.been.calledWith(errorBody)
        expect(result).to.deep.equal(errorBody)

        accountController.AccountService.createAccountWithInitialBalance.restore()

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

      sinon.stub(accountController.AccountService, 'getAccounts').returns(Promise.resolve(accounts))

      accountController.getAccounts({}, mockResponse).then((result) => {
        expect(accountController.AccountService.getAccounts).to.have.been.calledOnce()
        expect(mockResponse.status).to.have.been.calledWith(200)
        expect(mockResponse.status().send).to.have.been.calledWith(accounts)

        done()
      })
    })

    it('returns a 500 when unsuccessful', (done) => {
      sinon.stub(accountController.AccountService, 'getAccounts').returns(Promise.reject(new Error('getAccountsError')))

      accountController.getAccounts({}, mockResponse).then((result) => {
        expect(accountController.AccountService.getAccounts).to.have.been.calledOnce()
        expect(mockResponse.status).to.have.been.calledWith(500)
        expect(mockResponse.status().send).to.have.been.calledWith('getAccountsError')

        done()
      })
    })
  })

  describe('getAccount', () => {
    const mockRequest = {
      params: {
        id: 'account-1'
      }
    }

    it('returns a 404 when no account is found', (done) => {
      sinon.stub(accountController.AccountService, 'getAccountWithBalance').returns(Promise.reject(new Error('NOT FOUND')))

      accountController.getAccount(mockRequest, mockResponse).then((result) => {
        expect(accountController.AccountService.getAccountWithBalance).to.have.been.calledWith('account-1')
        expect(mockResponse.sendStatus).to.have.been.calledWith(404)

        accountController.AccountService.getAccountWithBalance.restore()

        done()
      })
    })

    it('returns a 500 when unsuccessful', (done) => {
      sinon.stub(accountController.AccountService, 'getAccountWithBalance').returns(Promise.reject(new Error('APPLICATION ERROR')))

      accountController.getAccount(mockRequest, mockResponse).then((result) => {
        expect(accountController.AccountService.getAccountWithBalance).to.have.been.calledWith('account-1')
        expect(mockResponse.status).to.have.been.calledWith(500)
        expect(mockResponse.status().send).to.have.been.calledWith('APPLICATION ERROR')

        accountController.AccountService.getAccountWithBalance.restore()

        done()
      })
    })

    it('returns a 200 when successful', (done) => {
      const account = {
        _id: 'account-1',
        balance: 0
      }

      sinon.stub(accountController.AccountService, 'getAccountWithBalance').returns(Promise.resolve(account))

      accountController.getAccount(mockRequest, mockResponse).then((result) => {
        expect(accountController.AccountService.getAccountWithBalance).to.have.been.calledWith('account-1')
        expect(mockResponse.status).to.have.been.calledWith(200)
        expect(mockResponse.status().send).to.have.been.calledWith(account)

        accountController.AccountService.getAccountWithBalance.restore()

        done()
      })
    })
  })
})
