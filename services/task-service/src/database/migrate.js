const { Sequelize } = require('sequelize');
const { Umzug, SequelizeStorage } = require('umzug');
const sequelize = require('./config/connection'); // or your db instance

const runMigrations = async () => {
  const umzug = new Umzug({
    migrations: { 
        glob: 'src/database/migrations/*.js',
        // 👇 Customize how migrations are executed
        resolve: ({ name, path, context }) => {
            const migration = require(path);
    
            return {
            name,
            up: async () => migration.up(context, Sequelize),
            down: async () => migration.down(context, Sequelize),
            };
        }
    },
    context: sequelize.getQueryInterface(),
    storage: new SequelizeStorage({ sequelize, tableName: 'SequelizeMeta' }),
    logger: console,
  });

  await umzug.up(); // runs pending migrations
};

module.exports = runMigrations;
