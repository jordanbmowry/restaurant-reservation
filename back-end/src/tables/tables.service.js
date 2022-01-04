const knex = require('../db/connection');
// returns all tables
function listAllTables() {
  return knex('tables').select('*').orderBy('table_name');
}
// returns a reservation for the specified id
function readIndividualTable(id) {
  return knex('tables').select('*').where({ table_id: id }).first();
}
// post a new table
function createNewTable(table) {
  return knex('tables')
    .insert(table)
    .returning('*')
    .then((NewTable) => NewTable[0]);
}
// for validation
function readIndividualReservation(id) {
  return knex('reservations').select('*').where({ reservation_id: id }).first();
}

// updates table after being assigned a reservation - also updates reservation status
async function updateTableAndReservationStatus(
  updatedTable,
  reservationId,
  updatedStatus
) {
  try {
    await knex.transaction(async (trx) => {
      const returnedUpdatedTable = await trx('tables')
        .where({ table_id: updatedTable.table_id })
        .update(updatedTable, '*')
        .then((updatedTables) => updatedTables[0]);

      const returnedUpdatedReservation = await trx('reservations')
        .where({ reservation_id: reservationId })
        .update({ status: updatedStatus }, '*')
        .then((updatedReservations) => updatedReservations[0]);
    });
  } catch (error) {
    // If we get here, neither the reservation nor table updates have taken place.
    console.error(error);
  }
}

module.exports = {
  create: createNewTable,
  list: listAllTables,
  read: readIndividualTable,
  readReservation: readIndividualReservation,
  update: updateTableAndReservationStatus,
};
