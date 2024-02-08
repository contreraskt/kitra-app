/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('treasures', (table) => {
      table.increments('id').primary();
      table.double('latitude').notNullable();
      table.double('longitude').notNullable();
      table.string('name').notNullable();
    });
  };
  

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable('treasures');
  };