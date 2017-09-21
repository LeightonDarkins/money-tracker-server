/* global describe it expect */

const AccountModel = require('./Account.model')
const mongoose = require('mongoose')
mongoose.Promise = global.Promise

describe('AccountModel', () => {
  describe('validation', () => {
    it('should be valid with balance as a string', (done) => {
      var account = new AccountModel({ name: 'test', balance: '100' })

      account.validate((err) => {
        expect(err).toBeNull()
        done()
      })
    })

    it('should be valid with balance as a number', (done) => {
      var account = new AccountModel({ name: 'test', balance: 100 })

      account.validate((err) => {
        expect(err).toBeNull()
        done()
      })
    })

    it('should be invalid if name is empty', (done) => {
      var account = new AccountModel({ balance: 200 })

      account.validate((err) => {
        expect(err.errors.name).toBeDefined()
        done()
      })
    })

    it('should be invalid if name is too short', (done) => {
      var account = new AccountModel({ name: '12', balance: 200 })

      account.validate((err) => {
        expect(err.errors.name).toBeDefined()
        done()
      })
    })

    it('should be invalid if balance is empty', (done) => {
      var account = new AccountModel({ name: 'test' })

      account.validate((err) => {
        expect(err.errors.balance).toBeDefined()
        done()
      })
    })

    it('should be invalid if balance is not a number', (done) => {
      var account = new AccountModel({ name: 'test', balance: 'test' })

      account.validate((err) => {
        expect(err.errors.balance).toBeDefined()
        done()
      })
    })
  })
})
