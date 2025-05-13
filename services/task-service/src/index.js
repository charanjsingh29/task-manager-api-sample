const app = require('./app');
const DefaultConnection= require('./database/config/connection');
const logger = require('./shared/utils/logger');
const migrationRunner = require('./database/migrate');

const PORT = process.env.PORT || 4003;

async function startServer() {
  try {
    await DefaultConnection.authenticate().then(async () => {
      logger.info('Default Database connection established successfully.');
      await migrationRunner();
    });

    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();