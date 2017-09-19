const sinon = require('sinon')
const ObjectID = require('mongodb').ObjectID
const AccountDB = require('./Account.db')
const AccountModel = require('../models/Account.model')

let accountDB

describe('Account DB', () => {
  describe('find', () => {
    it('translates DB ID to Model ID', (done) => {
      const expectedModels = [{ _id: '1234', name: 'test', balance: 100 }]

      const findResult = { exec: y => y }
      sinon.stub(findResult, 'exec')
      findResult.exec.resolves(expectedModels)

      sinon.stub(AccountModel, 'find')
      AccountModel.find.returns(findResult)

      accountDB = new AccountDB(AccountModel, ObjectID)

      accountDB.find().then(result => {
        expect(result.length).toEqual(1)
        expect(result[0].id).toEqual('1234')
        done()
      })

      findResult.exec.restore()
      AccountModel.find.restore()
    })
  })
})
