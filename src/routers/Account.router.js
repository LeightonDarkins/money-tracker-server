module.exports = class AccountRouter {
  constructor (controller) {
    this.controller = controller
  }

  setupRoutes (app) {
    app.get('/account', (req, res) => this.controller.getAccounts(req, res))
    app.delete('/account', (req, res) => this.controller.deleteAccounts(req, res))
    app.post('/account', (req, res) => this.controller.createAccount(req, res))
    app.get('/account/:id', (req, res) => this.controller.getAccount(req, res))
    app.delete('/account/:id', (req, res) => this.controller.deleteAccount(req, res))
    app.put('/account/:id', (req, res) => this.controller.updateAccount(req, res))
    app.get('/account/:id/balance', (req, res) => this.controller.getBalance(req, res))
    app.get('/account/:id/transactions', (req, res) => this.controller.getTransactions(req, res))
  }
}
