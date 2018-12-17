
exports.up = function (knex, Promise) {
  return knex.schema.createTable('topics', (topicsTable) => {
    topicsTable.string('slug').primary().notNullable();
    topicsTable.unique('slug');
    topicsTable.text('description');
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('topics');
};
