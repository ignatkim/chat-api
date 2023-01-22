const express = require('express');
const Users = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const user = new Users(req.body);
    user.generateToken();
    await user.save();
    return res.send(user);
  } catch (e) {
    return res.status(400).send(e);
  }
});

router.post('/sessions', async (req, res) => {
  const user = await Users.findOne({username: req.body.username});
  if (!user) {
    return res.status(401).send({error: 'Username or password is wrong'});
  }
  const isMatch = await user.checkPassword(req.body.password);
  if (!isMatch) {
    return res.status(401).send({error: 'Username or password is wrong'});
  }
  user.generateToken();
  await user.save();
  return res.send({message: 'Username and password are correct', user});
});

router.delete('/sessions', async (req, res) => {
  const token = req.get('Authorization');
  const success = {message: 'Success'};
  if (!token) return res.send(success);
  const user = await Users.findOne({token});
  if (!user) return res.send(success);
  user.generateToken();
  await user.save();
  return res.send(success);
});


module.exports = router;