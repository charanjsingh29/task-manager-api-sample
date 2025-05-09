const { Sequelize } = require('sequelize');
const { Umzug, SequelizeStorage } = require('umzug');
const sequelize = require('./config/connection'); // or your db instance

const runSeeder = async () => {
  const umzug = new Umzug({
    migrations: { 
        glob: 'src/database/seeders/*.js' ,

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
    storage: new SequelizeStorage({ sequelize, tableName: 'SequelizeData' }),
    logger: console,
  });

  await umzug.up(); // runs pending migrations
};



module.exports = runSeeder;
