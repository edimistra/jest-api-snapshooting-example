const server = require('./server');

server().then(() => {
  console.log('Server is running');
});
