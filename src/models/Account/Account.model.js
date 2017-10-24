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
  },
  balance: {
    type: Number,
    default: 0
  }
})

module.exports = mongoose.model('Account', AccountSchema)
