const knex = require('../db/connection');

function listReservationByDate(date) {
  return knex('reservations')
    .select('*')
    .where({ reservation_date: date })
    .orderBy('reservation_time');
}

function createReservation(reservation) {
  return knex('reservations')
    .insert(reservation)
    .returning('*')
    .then((first) => first[0]);
}

module.exports = {
  listReservationByDate,
  createReservation,
};
