const mongoose = require('mongoose')

const AccountSchema = mongoose.Schema({
  id: {
    type: String
  },
  name: {
    type: String,
    required: true,
    minlength: 3
  },
  openingBalance: {
    type: Number
  }
})

module.exports = mongoose.model('Account', AccountSchema)
