/* global describe, it, expect, beforeEach, afterEach */

const sinon = require('sinon')

const AccountService = require('./Account.service')

const mockLogger = {
  info: (y) => y
}

const mockAccountDB = {
  create: (y) => y
}

const mockTransactionDB = {
  create: (y) => y,
  findByAccountId: (y) => y
}

const mockDate = {
  now: () => 12345
}

describe('AccountService', () => {
  let accountService

  beforeEach(() => {
    accountService = new AccountService(mockLogger, mockAccountDB, mockTransactionDB, mockDate)
  })

  describe('createAccountWithInitialBalance', () => {
    let id, amount

    beforeEach(() => {
      id = 'account-1'
      amount = 1

      sinon.stub(mockAccountDB, 'create').returns(Promise.resolve({ _id: id, openingBalance: amount }))
      sinon.spy(accountService, '_createInitialTransaction')
      sinon.spy(mockTransactionDB, 'create')
    })

    afterEach(() => {
      mockAccountDB.create.restore()
      accountService._createInitialTransaction.restore()
      mockTransactionDB.create.restore()
    })

    it('calls create on AccountDB', (done) => {
      accountService.createAccountWithInitialBalance({ openingBalance: amount })
        .then(() => {
          expect(mockAccountDB.create).to.have.been.calledWith({ openingBalance: amount })
          expect(accountService._createInitialTransaction).to.have.been.calledWith(id, amount)
          expect(mockTransactionDB.create).to.have.been.calledWith({
            account: id,
            amount: amount,
            category: '59dd17f5549f1471ed426c31',
            date: mockDate.now()})

          done()
        })
    })
  })

  describe('getAccountBalance', () => {
    beforeEach(() => {
      sinon.stub(mockTransactionDB, 'findByAccountId').returns(Promise.resolve([{ amount: 1 }, { amount: 2 }]))
    })

    afterEach(() => {
      mockTransactionDB.findByAccountId.restore()
    })

    it('calls findByAccountId on TransactionDB and returns the correct balance', (done) => {
      accountService.getAccountBalance('account-1').then((output) => {
        expect(mockTransactionDB.findByAccountId).to.have.been.calledWith({ account: 'account-1' })
        expect(output).to.equal(3)

        done()
      })
    })
  })

  describe('_createInitialTransaction', () => {
    beforeEach(() => {
      sinon.spy(mockTransactionDB, 'create')
    })

    afterEach(() => {
      mockTransactionDB.create.restore()
    })

    it('calls create on TransactionDB with the correct initial-balance category', () => {
      accountService._createInitialTransaction('account-1', 100)

      expect(mockTransactionDB.create).to.have.been.calledWith({
        account: 'account-1',
        amount: 100,
        category: '59dd17f5549f1471ed426c31',
        date: mockDate.now()
      })
    })
  })
})
