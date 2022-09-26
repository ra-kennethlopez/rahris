/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('users', table => {
    table.string('id').primary()
    table.string('email')
    table.string('password')
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.unique(['email'])
  }).createTable('company', table => {
    table.string('id').primary()
    table.string('name')
    table.timestamp('created_at').defaultTo(knex.fn.now())
  }).createTable('employee', table => {
    table.string('id').primary()
    table.string('firstname')
    table.string('lastname')
    table.string('user_id')
    table.string('company_id')
    table.foreign('user_id').references('users.id')
    table.foreign('company_id').references('company.id')
  }).then(() => {
    console.log('Migration: Initial schema done')
  }).catch((reason) => {
    console.log('Migration: Initial schema failed')
    console.log(reason)
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('employee')
    .dropTableIfExists('company')
    .dropTableIfExists('users')
    .then(() => {
      console.log('Rollback: Dropped initial schema done')
    }).catch((reason) => {
      console.log('Rollback failed')
      console.log(reason)
  })
};
