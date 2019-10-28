
exports.up = function(knex, Promise) {
    return knex.schema.createTable('descriptions', table =>{
        table.increments('id').primary()
        table.string('codigo').notNull()
        table.string('name', 500).notNull()
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('descriptions')    
};
