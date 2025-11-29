// Vercel serverless entry: forwards requests to the Express app
const connect = require('../src/config/db');
const app = require('../src/app');

let isConnected = false;

module.exports = async (req, res) => {
  if (!isConnected) {
    await connect();
    isConnected = true;
  }
  return app(req, res);
};
