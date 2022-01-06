const knex = require('../db/connection');

function listReservationByDate(date) {
  return knex('reservations')
    .select('*')
    .where({ reservation_date: date })
    .whereNot('status', 'finished')
    .orderBy('reservation_time');
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

module.exports = {
  listReservationByDate,
  create: createReservation,
  read: readIndividualReservation,
  update: updateReservationStatus,
};
