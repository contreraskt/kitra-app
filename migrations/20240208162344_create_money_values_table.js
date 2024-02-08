/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('money_values', (table) => {
    table.increments('id').primary();
    table.integer('treasure_id').unsigned();
    table.integer('amt').notNullable(); 
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.down = function (knex) {
  return knex.schema.dropTable('money_values');
};
