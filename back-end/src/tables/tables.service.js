const knex = require('../db/connection');

function listAllTables() {
  return knex('tables').select('*').orderBy('table_name');
}

module.exports = {
  list: listAllTables,
};
