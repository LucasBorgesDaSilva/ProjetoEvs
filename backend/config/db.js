const config = require('../knexfile.js')
const knex = require('knex')(config)

//Sempre que tiver uma nova migração ele atualiza automaticamente, não recomendado
//knex.migrate.latest([config])

module.exports = knex