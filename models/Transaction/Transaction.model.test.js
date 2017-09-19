const TransactionModel = require('./Transaction.model')
const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const mockObjectID = '59c136fb87a7ae467fde6b21'
const mockDate = '01/01/2017'
const mockAmount = '100'

describe('Transaction', () => {
  describe('validation', () => {
    it('should be valid', (done) => {
      var transaction = new TransactionModel({
        amount: mockAmount,
        account: mockObjectID,
        category: mockObjectID,
        date: mockDate
      })

      transaction.validate((err) => {
        expect(err).toBeNull()
        done()
      })
    })

    it('should be invalid without an amount', (done) => {
      var transaction = new TransactionModel({
        account: mockObjectID,
        category: mockObjectID,
        date: mockDate
      })

      transaction.validate((err) => {
        expect(err.errors.amount).toBeDefined()
        done()
      })
    })

    it('should be invalid when amount is not a number', (done) => {
      var transaction = new TransactionModel({
        amount: 'test',
        account: mockObjectID,
        category: mockObjectID,
        date: mockDate
      })

      transaction.validate((err) => {
        expect(err.errors.amount).toBeDefined()
        done()
      })
    })

    it('should be invalid without an account', (done) => {
      var transaction = new TransactionModel({
        amount: mockAmount,
        category: mockObjectID,
        date: mockDate
      })

      transaction.validate((err) => {
        expect(err.errors.account).toBeDefined()
        done()
      })
    })

    it('should be invalid when account is not an ObjectID', (done) => {
      var transaction = new TransactionModel({
        amount: mockAmount,
        account: 'test',
        category: mockObjectID,
        date: mockDate
      })

      transaction.validate((err) => {
        expect(err.errors.account).toBeDefined()
        done()
      })
    })

    it('should be invalid without a category', (done) => {
      var transaction = new TransactionModel({
        amount: mockAmount,
        account: mockObjectID,
        date: mockDate
      })

      transaction.validate((err) => {
        expect(err.errors.category).toBeDefined()
        done()
      })
    })

    it('should be invalid when category is not an ObjectID', (done) => {
      var transaction = new TransactionModel({
        amount: mockAmount,
        account: mockObjectID,
        category: 'test',
        date: mockDate
      })

      transaction.validate((err) => {
        expect(err.errors.category).toBeDefined()
        done()
      })
    })

    it('should be invalid without a date', (done) => {
      var transaction = new TransactionModel({
        amount: mockAmount,
        account: mockObjectID,
        category: mockObjectID
      })

      transaction.validate((err) => {
        expect(err.errors.date).toBeDefined()
        done()
      })
    })

    it('should be invalid when date is not a valid date', (done) => {
      var transaction = new TransactionModel({
        amount: mockAmount,
        account: mockObjectID,
        category: mockObjectID,
        date: 'test'
      })

      transaction.validate((err) => {
        expect(err.errors.date).toBeDefined()
        done()
      })
    })
  })
})
