
exports.up = function(knex, Promise) {
    return knex.schema.createTable('projects', table =>{
        table.increments('id').primary()
        table.string('codigo').notNull()
        table.string('name').notNull()
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('projects')
};
