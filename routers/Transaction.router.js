module.exports = {
  setupRoutes: (controller, app) => {
    app.get('/transaction', (req, res) => controller.getTransactions(req, res))
    app.delete('/transaction', (req, res) => controller.deleteTransactions(req, res))
    app.post('/transaction', (req, res) => controller.createTransaction(req, res))
    app.get('/transaction/:id', (req, res) => controller.getTransaction(req, res))
    app.delete('/transaction/:id', (req, res) => controller.deleteTransaction(req, res))
    app.put('/transaction/:id', (req, res) => controller.updateTransaction(req, res))
  }
}
