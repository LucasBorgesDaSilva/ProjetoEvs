const { db } = require('./.env')

module.exports = {
  dialect: 'mysql',
  connection: db,
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: 'knex_migrations'
  }
};
