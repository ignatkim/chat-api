const express = require("express");
const cors = require('cors');
const {nanoid} = require('nanoid');
const auth = require("../middleware/auth");
const Message = require("../models/Message");
const User = require("../models/User");


const chat = express();

require('express-ws')(chat);

const activeConnections = {};

chat.ws('/', auth, async (ws, req) => {
  const user = req.user;
  const id = user._id;
  console.log('Client connected with id = ', id);
  const messages = await Message.find().populate('author', 'username');
  activeConnections[id] = ws;
  let users = [];
  for (const key of Object.keys(activeConnections)) {
    const user = await User.findById(key);
    users.push({username: user.username, id: user._id});
  }

  ws.send(JSON.stringify({type: 'CONNECTED', messages: messages.length < 30 ? messages : messages.splice(30)}));

  Object.keys(activeConnections).forEach(key => {
    const connection = activeConnections[key];
    connection.send(JSON.stringify({type: 'USER_CONNECTED', users: users, user: user.username}))
  });

  ws.on('message', async msg => {
    try {
      const decoded = JSON.parse(msg);
      const messageData = {
        message: decoded.message,
        author: user._id
      };
      const message = new Message(messageData).populate('author', 'username');
      await message.save();
      if (decoded.type === 'CREATE_MESSAGE') {
        Object.keys(activeConnections).forEach(key => {
          const connection = activeConnections[key];
          connection.send(JSON.stringify({
            type: "NEW_MESSAGE",
            message: {
              author: {username: user.username},
              message: decoded.message
            }
          }));
        });
      }
    } catch (e) {
    }
  });

  ws.on('close', async () => {
    console.log('Client disconnected with id = ', id);
    delete activeConnections[id];
    const userClose = await User.findById(id);
    let users = [];
    for (const key of Object.keys(activeConnections)) {
      const user = await User.findById(key);
      users.push({username: user.username, id: user._id});
    }
    Object.keys(activeConnections).forEach(key => {
      const connection = activeConnections[key];
      connection.send(JSON.stringify({type: 'USER_DISCONNECTED', users: users, user: userClose.username}))
    });
  });
});

module.exports = chat;

