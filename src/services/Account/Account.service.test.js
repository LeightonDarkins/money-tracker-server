/* global describe, it, jest, expect, beforeEach, afterEach */

const sinon = require('sinon')

const AccountService = require('./Account.service')

const mockLogger = {
  info: (y) => y
}

const mockAccountDB = {
  create: jest.fn()
}

const mockTransactionDB = {
  create: jest.fn(),
  findByAccountId: jest.fn()
}

const mockDate = {
  now: () => 12345
}

describe('AccountService', () => {
  let accountService

  beforeEach(() => {
    accountService = new AccountService(mockLogger, mockAccountDB, mockTransactionDB, mockDate)
  })

  afterEach(() => {
    mockAccountDB.create.mockReset()
    mockTransactionDB.create.mockReset()
    mockTransactionDB.findByAccountId.mockReset()
  })

  describe('createAccountWithInitialBalance', () => {
    it('calls create on AccountDB', (done) => {
      mockAccountDB.create.mockReturnValue(Promise.resolve({ _id: 'account-1', openingBalance: 1 }))
      sinon.spy(accountService, '_createInitialTransaction')

      accountService.createAccountWithInitialBalance({ openingBalance: 1 })

      expect(mockAccountDB.create).toHaveBeenCalledWith({ openingBalance: 1 })

      setTimeout(() => {
        expect(accountService._createInitialTransaction.called).toBeTruthy()
        expect(mockTransactionDB.create).toHaveBeenCalled()

        accountService._createInitialTransaction.restore()

        done()
      }, 0)
    })
  })

  describe('getAccountBalance', () => {
    it('calls findByAccountId on TransactionDB and returns the correct balance', () => {
      mockTransactionDB.findByAccountId.mockReturnValue(Promise.resolve([{ amount: 1 }, { amount: 2 }]))

      accountService.getAccountBalance('account-1').then((output) => {
        expect(output).toEqual(3)
      })

      expect(mockTransactionDB.findByAccountId).toHaveBeenCalledWith({ account: 'account-1' })
    })
  })

  describe('_createInitialTransaction', () => {
    it('calls create on TransactionDB with the correct initial-balance category', () => {
      accountService._createInitialTransaction('account-1', 100)

      expect(mockTransactionDB.create).toHaveBeenCalledTimes(1)
      expect(mockTransactionDB.create).toHaveBeenCalledWith({
        account: 'account-1',
        amount: 100,
        category: '59dd17f5549f1471ed426c31',
        date: mockDate.now()
      })

      mockTransactionDB.create.mockReset()
    })
  })
})
