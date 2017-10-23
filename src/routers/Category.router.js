module.exports = {
  setupRoutes: (controller, app) => {
    app.get('/category', (req, res) => controller.getCategories(req, res))
    app.delete('/category', (req, res) => controller.deleteCategories(req, res))
    app.post('/category', (req, res) => controller.createCategory(req, res))
    app.get('/category/:id', (req, res) => controller.getCategory(req, res))
    app.delete('/category/:id', (req, res) => controller.deleteCategory(req, res))
    app.put('/category/:id', (req, res) => controller.updateCategory(req, res))
  }
}
