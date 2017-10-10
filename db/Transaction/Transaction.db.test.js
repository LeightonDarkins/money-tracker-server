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
  beforeEach(() => {
    sinon.spy(TransactionModel, 'find')

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

      expect(dbUnderTest._buildQuery.called).toEqual(false)
    })

    it('calls .find() on the Model with the given query object', () => {
      const query = { account: 123 }

      dbUnderTest.findByAccountId(query)

      expect(TransactionModel.find.calledOnce).toEqual(true)
      expect(TransactionModel.find.getCall(0).args[0]).toEqual(query)
    })
  })

  describe('find', () => {
    it('calls _buildQuery', () => {
      dbUnderTest.find('testing12345')

      expect(dbUnderTest._buildQuery.calledOnce).toEqual(true)
    })

    it('calls .find() on the Model with the correct query', () => {
      dbUnderTest.find('testing12345')

      expect(TransactionModel.find.calledOnce).toEqual(true)

      const functionArgument = TransactionModel.find.getCall(0).args[0]

      expect(typeof functionArgument).toEqual('object')
      expect(typeof functionArgument).not.toEqual('string')
    })
  })
})
