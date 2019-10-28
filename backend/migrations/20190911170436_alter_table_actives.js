
exports.up = function(knex, Promise) {
    return knex.schema.alterTable('actives', table => {
    table.string('numAntigo')
    table.string('anoFabricacao') 
    }) 
};

exports.down = function(knex, Promise) {
    return knex.schema.alterTable('actives', table =>{
    table.dropColumn('numAntigo')
    table.dropColumn('anoFabricacao')  
    })
};
