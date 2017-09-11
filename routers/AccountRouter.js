module.exports = {
  setupRoutes: (controller, app) => {
    app.get('/account', (req, res) => controller.getAccounts(req, res))
    app.delete('/account', (req, res) => controller.deleteAccounts(req, res))
    app.post('/account', (req, res) => controller.createAccount(req, res))
    app.get('/account/:id', (req, res) => controller.getAccount(req, res))
    app.delete('/account/:id', (req, res) => controller.deleteAccount(req, res))
    app.put('/account/:id', (req, res) => controller.updateAccount(req, res))
  }
}
