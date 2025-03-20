import app from './index.js';
import http from 'http';
import { mongoConnect } from './model/connection.js';
const { MONGO_URI, PORT = 4000 } = process.env;

const server = http.createServer(app);

async function startServer() {
  try {
    await mongoConnect(MONGO_URI);
    console.log('Connected to Mongo DB....');
    server.listen(PORT, () => {
      console.log(`Listening on port ${PORT}...`);
    });
  } catch (error) {
    console.error('Error starting server: ', error);
  }
}

startServer();
