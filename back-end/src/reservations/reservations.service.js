const knex = require('../db/connection');

function listReservationByDate(date) {
  return knex('reservations')
    .select('*')
    .where({ reservation_date: date })
    .whereNot({ status: 'finished' })
    .whereNot({ status: 'cancelled' })
    .orderBy('reservation_time');
}

function listReservationByMobileNumber(mobile_number) {
  return knex('reservations')
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, '')}%`
    )
    .orderBy('reservation_date');
}

function createReservation(reservation) {
  return knex('reservations')
    .insert(reservation)
    .returning('*')
    .then((first) => first[0]);
}

function readIndividualReservation(id) {
  return knex('reservations').select('*').where({ reservation_id: id }).first();
}

function updateReservationStatus(id, status) {
  return knex('reservations')
    .where({ reservation_id: id })
    .update({ status }, '*')
    .then((first) => first[0]);
}

function updateReservation(id, updatedReservation) {
  return knex('reservations')
    .where({ reservation_id: id })
    .update(updatedReservation, '*')
    .then((first) => first[0]);
}

module.exports = {
  listReservationByMobileNumber,
  listReservationByDate,
  create: createReservation,
  read: readIndividualReservation,
  updateStatus: updateReservationStatus,
  update: updateReservation,
};
