class CategoryRouter {
  constructor (controller) {
    this.controller = controller
  }

  setupRoutes (app) {
    app.get('/category', (req, res) => this.controller.getCategories(req, res))
    app.delete('/category', (req, res) => this.controller.deleteCategories(req, res))
    app.post('/category', (req, res) => this.controller.createCategory(req, res))
    app.get('/category/:id', (req, res) => this.controller.getCategory(req, res))
    app.delete('/category/:id', (req, res) => this.controller.deleteCategory(req, res))
    app.put('/category/:id', (req, res) => this.controller.updateCategory(req, res))
  }
}

module.exports = CategoryRouter
