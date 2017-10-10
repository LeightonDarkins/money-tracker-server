/* global describe it expect */

const AccountModel = require('./Account.model')
const mongoose = require('mongoose')
mongoose.Promise = global.Promise

describe('AccountModel', () => {
  describe('validation', () => {
    it('should be valid with openingBalance as a string', (done) => {
      var account = new AccountModel({ name: 'test', openingBalance: '100' })

      account.validate((err) => {
        expect(err).toBeNull()
        done()
      })
    })

    it('should be valid with openingBalance as a number', (done) => {
      var account = new AccountModel({ name: 'test', openingBalance: 100 })

      account.validate((err) => {
        expect(err).toBeNull()
        done()
      })
    })

    it('should be valid if openingBalance is empty', (done) => {
      var account = new AccountModel({ name: 'test' })

      account.validate((err) => {
        expect(err).toBeNull()
        done()
      })
    })

    it('should be invalid if name is empty', (done) => {
      var account = new AccountModel({ openingBalance: 200 })

      account.validate((err) => {
        expect(err.errors.name).toBeDefined()
        done()
      })
    })

    it('should be invalid if name is too short', (done) => {
      var account = new AccountModel({ name: '12', openingBalance: 200 })

      account.validate((err) => {
        expect(err.errors.name).toBeDefined()
        done()
      })
    })

    it('should be invalid if balance is not a number', (done) => {
      var account = new AccountModel({ name: 'test', openingBalance: 'test' })

      account.validate((err) => {
        expect(err.errors.openingBalance).toBeDefined()
        done()
      })
    })
  })
})
