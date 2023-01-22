const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  author: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});


const Message = mongoose.model('Message', MessageSchema);
module.exports = Message;