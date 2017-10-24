/* global describe, it, beforeEach */

const request = require('supertest')
const mockServer = require('./MockServer')

const CategoryRouter = require('./Category.router')

const mockController = {
  getCategories: (req, res) => res.send('getCategories'),
  deleteCategories: (req, res) => res.send('deleteCategories'),
  createCategory: (req, res) => res.send('createCategory'),
  getCategory: (req, res) => res.send('getCategory'),
  deleteCategory: (req, res) => res.send('deleteCategory'),
  updateCategory: (req, res) => res.send('updateCategory')
}

describe('CategoryRouter', () => {
  beforeEach(() => {
    const router = new CategoryRouter(mockController)
    router.setupRoutes(mockServer)
  })

  it('GET /category routes to getCategories', (done) => {
    request(mockServer)
      .get('/category')
      .expect('getCategories')
      .end((error) => error ? done(error) : done())
  })

  it('DELETE /category routes to deleteCategories', (done) => {
    request(mockServer)
      .delete('/category')
      .expect('deleteCategories')
      .end((error) => error ? done(error) : done())
  })

  it('POST /category routes to createCategory', (done) => {
    request(mockServer)
      .post('/category')
      .expect('createCategory')
      .end((error) => error ? done(error) : done())
  })

  it('GET /category/1 routes to getCategory', (done) => {
    request(mockServer)
      .get('/category/1')
      .expect('getCategory')
      .end((error) => error ? done(error) : done())
  })

  it('DELETE /category/1 routes to deleteCategory', (done) => {
    request(mockServer)
      .delete('/category/1')
      .expect('deleteCategory')
      .end((error) => error ? done(error) : done())
  })

  it('PUT /category/1 routes to updateCategory', (done) => {
    request(mockServer)
      .put('/category/1')
      .expect('updateCategory')
      .end((error) => error ? done(error) : done())
  })
})
