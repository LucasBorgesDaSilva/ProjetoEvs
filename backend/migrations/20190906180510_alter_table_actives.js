
exports.up = function(knex, Promise) {
    return knex.schema.alterTable('actives', table=>{
        table.dropColumn('descriptionDefault')
        table.timestamp('addAt')
        table.dropColumn('numAntigo')
        table.dropColumn('anoFabricacao')
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.alterTable('actives', table =>{
        table.string('descriptionDefault')
        table.integer('numAntigo')
        table.integer('anoFabricacao')
        table.dropColumn('addAt')
    })
};
