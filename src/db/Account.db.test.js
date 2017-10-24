/* global describe, it, expect, beforeEach, afterEach */

const sinon = require('sinon')
const ObjectID = require('mongodb').ObjectID
const AccountDB = require('./Account.db')
const AccountModel = require('../models/Account.model')

let accountDB

describe('Account DB', () => {
  describe('find', () => {
    let findResult, expectedModels

    beforeEach(() => {
      expectedModels = [{ _id: '1234', name: 'test', balance: 100 }]
      findResult = { exec: y => y }

      sinon.stub(findResult, 'exec').resolves(expectedModels)

      sinon.stub(AccountModel, 'find').returns(findResult)
    })

    afterEach(() => {
      findResult.exec.restore()
      AccountModel.find.restore()
    })

    it('translates DB ID to Model ID', (done) => {
      accountDB = new AccountDB(AccountModel, ObjectID)

      accountDB.find().then(result => {
        expect(result.length).to.equal(1)
        expect(result[0].id).to.equal('1234')

        done()
      })
    })
  })
})
