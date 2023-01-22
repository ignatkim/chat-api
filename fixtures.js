const mongoose = require('mongoose');
const config = require('./config');
const User = require("./models/User");
const {nanoid} = require('nanoid');

const run = async () => {
  await mongoose.connect(config.db.url, config.db.options);
  const collections = await mongoose.connection.db.listCollections().toArray();

  for (const coll of collections) {
    await mongoose.connection.db.dropCollection(coll.name);
  }

  await User.create({
    username: 'user',
    password: '1qaz@WSX29',
    token: nanoid(),
  }, {
    username: 'admin',
    password: '1qaz@WSX29',
    token: nanoid(),
  });

  await mongoose.connection.close();

};

run().catch(console.error);