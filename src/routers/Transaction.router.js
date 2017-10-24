class TransactionRouter {
  constructor (controller) {
    this.controller = controller
  }

  setupRoutes (app) {
    app.get('/transaction', (req, res) => this.controller.getTransactions(req, res))
    app.delete('/transaction', (req, res) => this.controller.deleteTransactions(req, res))
    app.post('/transaction', (req, res) => this.controller.createTransaction(req, res))
    app.get('/transaction/:id', (req, res) => this.controller.getTransaction(req, res))
    app.delete('/transaction/:id', (req, res) => this.controller.deleteTransaction(req, res))
    app.put('/transaction/:id', (req, res) => this.controller.updateTransaction(req, res))
  }
}

module.exports = TransactionRouter
