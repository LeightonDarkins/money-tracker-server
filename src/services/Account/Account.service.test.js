/* global describe, it, expect, beforeEach, afterEach */

const sinon = require('sinon')

const AccountService = require('./Account.service')

const mockLogger = {
  info: (y) => y
}

const mockAccountDB = {
  create: (y) => y,
  find: (y) => y
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

  describe('getAccounts', () => {
    beforeEach(() => {
      let accounts = [
        {
          _id: 'account-1',
          name: 'First Account'
        },
        {
          _id: 'account-2',
          name: 'Second Account'
        }
      ]

      sinon.stub(mockAccountDB, 'find').returns(Promise.resolve(accounts))
      sinon.stub(accountService, '_applyBalancesToAccounts').returns(Promise.resolve({}))
    })

    afterEach(() => {
      mockAccountDB.find.restore()
      accountService._applyBalancesToAccounts.restore()
    })

    it('calls find on AccountDB', (done) => {
      accountService.getAccounts()
        .then(() => {
          expect(mockAccountDB.find).to.have.been.called()
          expect(accountService._applyBalancesToAccounts).to.have.been.called()
          done()
        })
    })
  })

  describe('_getAccountBalances', () => {
    beforeEach(() => {
      sinon.stub(accountService, 'getAccountBalance').returns(Promise.resolve({}))
    })

    afterEach(() => {
      accountService.getAccountBalance.restore()
    })

    it('calls getAccountBalance once for each account it recieves', (done) => {
      let accounts = [
        'account-1',
        'account-2',
        'account-3'
      ]

      accountService._getAccountBalances(accounts).then((balances) => {
        expect(accountService.getAccountBalance).to.have.callCount(3)
        expect(balances).to.have.length(3)

        done()
      })
    })
  })

  describe('_applyBalancesToAccounts', () => {
    beforeEach(() => {
      sinon.stub(accountService, '_getAccountBalances').returns(Promise.resolve([ 100, 200, 300 ]))
    })

    afterEach(() => {
      accountService._getAccountBalances.restore()
    })

    it('calls getAccountBalances and applies the balances to the given accounts', (done) => {
      let accounts = [
        {
          balance: 0
        },
        {
          balance: 0
        },
        {
          balance: 0
        }
      ]

      accountService._applyBalancesToAccounts(accounts).then((result) => {
        expect(accountService._getAccountBalances).to.have.been.calledOnce()
        expect(accounts[0].balance).to.equal(100)
        expect(accounts[1].balance).to.equal(200)
        expect(accounts[2].balance).to.equal(300)

        done()
      })
    })
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
