const express = require('express');

const postsRouter = require('./posts-router.js');

const server = express();

server.get('/', (req, res) => {
  res.send(`
    <h2>Lambda WEBAPI II</h2>
    <p>Generic Landing Page</p>
  `);
});

server.use('/api/posts', postsRouter)


// add an endpoint that returns all the messages for a hub
// add an endpoint for adding new message to a hub

server.listen(4000, () => {
  console.log('\n*** Server Running on http://localhost:4000 ***\n');
});
