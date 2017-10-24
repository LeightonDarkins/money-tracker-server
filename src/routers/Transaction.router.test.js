/* global describe, it, beforeEach */

const request = require('supertest')
const mockServer = require('./MockServer')

const TransactionRouter = require('./Transaction.router')

const mockController = {
  getTransactions: (req, res) => res.send('getTransactions'),
  deleteTransactions: (req, res) => res.send('deleteTransactions'),
  createTransaction: (req, res) => res.send('createTransaction'),
  getTransaction: (req, res) => res.send('getTransaction'),
  deleteTransaction: (req, res) => res.send('deleteTransaction'),
  updateTransaction: (req, res) => res.send('updateTransaction')
}

describe('TransactionRouter', () => {
  beforeEach(() => {
    const router = new TransactionRouter(mockController)
    router.setupRoutes(mockServer)
  })

  it('GET /transaction routes to getTransactions', (done) => {
    request(mockServer)
      .get('/transaction')
      .expect('getTransactions')
      .end((error) => error ? done(error) : done())
  })

  it('DELETE /transaction routes to deleteTransactions', (done) => {
    request(mockServer)
      .delete('/transaction')
      .expect('deleteTransactions')
      .end((error) => error ? done(error) : done())
  })

  it('POST /transaction routes to createTransaction', (done) => {
    request(mockServer)
      .post('/transaction')
      .expect('createTransaction')
      .end((error) => error ? done(error) : done())
  })

  it('GET /transaction/1 routes to getTransaction', (done) => {
    request(mockServer)
      .get('/transaction/1')
      .expect('getTransaction')
      .end((error) => error ? done(error) : done())
  })

  it('DELETE /transaction/1 routes to deleteTransaction', (done) => {
    request(mockServer)
      .delete('/transaction/1')
      .expect('deleteTransaction')
      .end((error) => error ? done(error) : done())
  })

  it('PUT /transaction/1 routes to updateTransaction', (done) => {
    request(mockServer)
      .put('/transaction/1')
      .expect('updateTransaction')
      .end((error) => error ? done(error) : done())
  })
})
