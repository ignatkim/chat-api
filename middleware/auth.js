const User = require('../models/User');

const auth = async (ws, req, next) => {
  const token = req.query.token;
  if (!token) {
    return ws.send(JSON.stringify({type: 'ERROR', error: 'Wrong token, login again'}));
  }
  const user = await User.findOne({token});

  if (!user) {
    return ws.send(JSON.stringify({type: 'ERROR', error: 'Wrong token, logout from other devices and try again'}));
  }

  req.user = user;

  next();
};

module.exports = auth;