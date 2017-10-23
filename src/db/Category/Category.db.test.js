/* global describe it expect */

const sinon = require('sinon')
const ObjectID = require('mongodb').ObjectID
const CategoryDB = require('./Category.db')
const CategoryModel = require('../../models/Category/Category.model')

let categoryDb

describe('Account DB', () => {
  describe('find', () => {
    it('translates DB ID to Model ID', (done) => {
      const expectedModels = [{ _id: '1234', name: 'test' }]

      const findResult = { exec: y => y }
      sinon.stub(findResult, 'exec')
      findResult.exec.resolves(expectedModels)

      sinon.stub(CategoryModel, 'find')
      CategoryModel.find.returns(findResult)

      categoryDb = new CategoryDB(CategoryModel, ObjectID)

      categoryDb.find().then(result => {
        expect(result.length).toEqual(1)
        expect(result[0].id).toEqual('1234')
        done()
      })

      findResult.exec.restore()
      CategoryModel.find.restore()
    })
  })
})
