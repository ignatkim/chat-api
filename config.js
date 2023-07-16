const path = require('path');
const rootPath = __dirname;

console.log(process.env.MONGODB_URI);

module.exports = {
  rootPath,
  uploadPath: path.join(rootPath, 'public/uploads'),
  db: {
    url: process.env.MONGODB_URI || 'mongodb://localhost/chat',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    },
  }
};

