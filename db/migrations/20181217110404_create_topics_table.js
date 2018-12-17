
exports.up = function (knex, Promise) {
  return knex.schema.createTable('topics', (topicsTable) => {
    topicsTable.string('slug').primary().notNullable();
    topicsTable.unique('slug');
    topicsTable.string('description', 511);
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('topics');
};
