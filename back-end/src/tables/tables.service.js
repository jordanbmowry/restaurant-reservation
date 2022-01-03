const knex = require('../db/connection');

function listAllTables() {
  return knex('tables').select('*').orderBy('table_name');
}

function readIndividualTable(id) {
  return knex('tables').select('*').where({ table_id: id }).first();
}
// for validation
function readIndividualReservation(id) {
  return knex('reservations').select('*').where({ reservation_id: id }).first();
}

module.exports = {
  list: listAllTables,
  read: readIndividualTable,
  readReservation: readIndividualReservation,
};
