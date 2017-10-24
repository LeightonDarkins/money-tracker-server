/* global describe it expect, beforeEach, afterEach */

const sinon = require('sinon')
const ObjectID = require('mongodb').ObjectID
const CategoryDB = require('./Category.db')
const CategoryModel = require('../../models/Category/Category.model')

let categoryDb

describe('Account DB', () => {
  describe('find', () => {
    let expectedModels, findResult

    beforeEach(() => {
      expectedModels = [{ _id: '1234', name: 'test' }]
      findResult = { exec: y => y }

      sinon.stub(findResult, 'exec').resolves(expectedModels)
      sinon.stub(CategoryModel, 'find').returns(findResult)

      categoryDb = new CategoryDB(CategoryModel, ObjectID)
    })

    afterEach(() => {
      findResult.exec.restore()
      CategoryModel.find.restore()
    })

    it('translates DB ID to Model ID', (done) => {
      categoryDb.find().then(result => {
        expect(result.length).to.equal(1)
        expect(result[0].id).to.equal('1234')
        done()
      })
    })
  })
})
