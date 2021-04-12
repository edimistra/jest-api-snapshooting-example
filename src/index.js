const server = require('./server');

server.server().then(() => {
  console.log('Server is running');
});
