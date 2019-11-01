const express = require('express');
const helmet = require('helmet');
// const actionRouter = require('./actions/actionsRouter');
const projectRouter = require('./projects/projectsRouter');

const server = express();

server.use(helmet());
server.use(express.json());
server.use(logger);

server.use('/api/projects', projectRouter);
// server.use('/api/actions', actionRouter);

server.get('/', (req, res) => {
    res.send(`<h2>Let's write some middleware</h2>`);
});

// A custom middleware to log in every method that is called
function logger(req, res, next) {
    console.log(
      `[${new Date().toISOString()}] ${req.method} to ${req.url} from ${req.get(
          `Origin`
      )}`
    );
    next();
  }

module.exports = server;

