/* eslint-env jest */

const request = require('supertest')
const mockServer = require('./MockServer')

const AccountRouter = require('./Account.router')

const mockAccountController = {
  getAccounts: (req, res) => res.send('getAccounts'),
  deleteAccounts: (req, res) => res.send('deleteAccounts'),
  createAccount: (req, res) => res.send('createAccount'),
  getAccount: (req, res) => res.send('getAccount'),
  deleteAccount: (req, res) => res.send('deleteAccount'),
  updateAccount: (req, res) => res.send('updateAccount'),
  getBalance: (req, res) => res.send('getBalance'),
  getTransactions: (req, res) => res.send('getTransactions')
}

describe('AccountRouter', () => {
  let accountRouter

  beforeEach(() => {
    accountRouter = new AccountRouter(mockAccountController)
    accountRouter.setupRoutes(mockServer)
  })

  it('GET /account routes to getAccounts', done => {
    request(mockServer)
      .get('/account')
      .expect('getAccounts')
      .end((error) => error ? done(error) : done())
  })

  it('DELETE /account routes to deleteAccounts', done => {
    request(mockServer)
      .delete('/account')
      .expect('deleteAccounts')
      .end((error) => error ? done(error) : done())
  })

  it('POST /account routes to createAccount', done => {
    request(mockServer)
      .post('/account')
      .expect('createAccount')
      .end((error) => error ? done(error) : done())
  })

  it('GET /account/1 routes to getAccount', done => {
    request(mockServer)
      .get('/account/1')
      .expect('getAccount')
      .end((error) => error ? done(error) : done())
  })

  it('DELETE /account/1 routes to deleteAccount', done => {
    request(mockServer)
      .delete('/account/1')
      .expect('deleteAccount')
      .end((error) => error ? done(error) : done())
  })

  it('PUT /account/1 routes to updateAccount', done => {
    request(mockServer)
      .put('/account/1')
      .expect('updateAccount')
      .end((error) => error ? done(error) : done())
  })

  it('GET /account/1/balance routes to getBalance', done => {
    request(mockServer)
      .get('/account/1/balance')
      .expect('getBalance')
      .end((error) => error ? done(error) : done())
  })

  it('GET /account/1/transactions routes to getTransactions', done => {
    request(mockServer)
      .get('/account/1/transactions')
      .expect('getTransactions')
      .end((error) => error ? done(error) : done())
  })
})
