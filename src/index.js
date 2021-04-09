const server = require('./server')

server().then(async () => {
  await insertAd({title: 'Hello, now from the in-memory database!'});
  console.log("Server is running")
})