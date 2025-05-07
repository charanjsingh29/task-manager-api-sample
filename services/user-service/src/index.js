const app = require('./app');
const http = require('http');
const DefaultConnection= require('./database/config/connection');
const logger = require('./shared/utils/logger');
const socket = require('./shared/utils/socket');
// require('./crons');


const PORT = process.env.PORT || 4001;

async function startServer() {
  try {
    await DefaultConnection.authenticate();
    logger.info('Default Database connection established successfully.');

    const server = http.createServer(app);

    socket.init(server)
    
    // require('./listeners')

    server.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();