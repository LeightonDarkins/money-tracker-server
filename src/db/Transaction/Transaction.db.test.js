/* global describe, it, beforeEach, afterEach, expect */

const sinon = require('sinon')
const TransactionDB = require('./Transaction.db.js')
const ObjectID = require('mongodb').ObjectID
let dbUnderTest

const TransactionModel = {
  find: () => {
    return { exec: (x) => Promise.resolve(x) }
  }
}

describe('TransactionDB', () => {
  let transactions = [
    { id: 'transaction-1', date: 45 },
    { id: 'transaction-2', date: 95 },
    { id: 'transaction-3', date: 76 }
  ]

  beforeEach(() => {
    sinon.stub(TransactionModel, 'find').returns({ exec: () => Promise.resolve(transactions) })

    dbUnderTest = new TransactionDB(TransactionModel, ObjectID)

    sinon.spy(dbUnderTest, '_buildQuery')
  })

  afterEach(() => {
    TransactionModel.find.restore()
    dbUnderTest._buildQuery.restore()
    dbUnderTest = undefined
  })

  describe('findByAccountId', () => {
    it('does not call _buildQuery', () => {
      dbUnderTest.findByAccountId()

      expect(dbUnderTest._buildQuery.called).to.equal(false)
    })

    it('calls .find() on the Model with the given query object', () => {
      const query = { account: 123 }

      dbUnderTest.findByAccountId(query)

      expect(TransactionModel.find.calledOnce).to.equal(true)
      expect(TransactionModel.find.getCall(0).args[0]).to.equal(query)
    })

    it('orders transactions by date', () => {
      dbUnderTest.findByAccountId()
        .then(result => {
          expect(result[0].date).to.equal(95)
          expect(result[1].date).to.equal(76)
          expect(result[2].date).to.equal(45)
        })
    })
  })

  describe('find', () => {
    it('calls _buildQuery', () => {
      dbUnderTest.find('testing12345')

      expect(dbUnderTest._buildQuery.calledOnce).to.equal(true)
    })

    it('calls .find() on the Model with the correct query', () => {
      dbUnderTest.find('testing12345')

      expect(TransactionModel.find.calledOnce).to.equal(true)

      const functionArgument = TransactionModel.find.getCall(0).args[0]

      expect(typeof functionArgument).to.equal('object')
      expect(typeof functionArgument).to.not.equal('string')
    })
  })
})
