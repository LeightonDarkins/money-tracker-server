const mongoose = require('mongoose')
var ObjectId = mongoose.Schema.Types.ObjectId;

const TransactionSchema = mongoose.Schema({
  id: {
    type: String
  },
  amount: {
    type: Number,
    required: true
  },
  category: {
    type: ObjectId,
    required: true
  },
  date: {
    type: Date,
    required: true
  }
})

module.exports = mongoose.model('Transaction', TransactionSchema)
