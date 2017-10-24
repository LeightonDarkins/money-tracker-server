/* global describe it expect */

const CategoryModel = require('./Category.model')
const mongoose = require('mongoose')
mongoose.Promise = global.Promise

describe('CategoryModel', () => {
  describe('validation', () => {
    it('should be valid', (done) => {
      const category = new CategoryModel({ name: 'test' })

      category.validate(err => {
        expect(err).to.be.null()

        done()
      })
    })

    it('should be invalid without a name', (done) => {
      const category = new CategoryModel()

      category.validate(result => {
        expect(result.errors.name).to.exist()

        done()
      })
    })

    it('should be invalid with a name that is too short', (done) => {
      const category = new CategoryModel({ name: 'te' })

      category.validate(result => {
        expect(result.errors.name).to.exist()

        done()
      })
    })
  })
})
