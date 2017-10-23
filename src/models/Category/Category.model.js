const mongoose = require('mongoose')

const CategorySchema = mongoose.Schema({
  id: {
    type: String
  },
  name: {
    type: String,
    required: true,
    minlength: 3
  }
})

module.exports = mongoose.model('Category', CategorySchema)
