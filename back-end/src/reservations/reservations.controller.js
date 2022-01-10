const hasProperties = require('../errors/hasProperties');
const isPast = require('date-fns/isPast');
const service = require('./reservations.service');
const asyncErrorBoundary = require('../errors/asyncErrorBoundary');
const hasOnlyValidProperties = require('../errors/hasOnlyValidProperties');
const validator = require('validator');

// Validation ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
const hasRequiredProperties = hasProperties(
  'first_name',
  'last_name',
  'mobile_number',
  'reservation_date',
  'reservation_time',
  'people'
);

const VALID_PROPERTIES = [
  'first_name',
  'last_name',
  'mobile_number',
  'reservation_date',
  'reservation_time',
  'people',
  'reservation_id',
  'created_at',
  'updated_at',
  'status',
];

const reservationHasOnlyValidProperties =
  hasOnlyValidProperties(VALID_PROPERTIES);

function dateIsTuesday(dateString) {
  const date = new Date(dateString);
  return date.getUTCDay() === 2;
}

function isDateInFuture(dateString, timeString) {
  const reservationDate = dateString + 'T' + timeString;

  const utc = new Date(reservationDate).toUTCString();

  return validator.isAfter(utc);
}

//regex for validating time
const timeRegex = /^(?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d)$/;

function timeIsValid(timeString) {
  return timeString.match(timeRegex)?.[0];
}

function reservationTimeIsValid(timeString) {
  const openingTimeString = '10:30';
  const closingTimeSting = '21:30';
  return timeString <= closingTimeSting && timeString >= openingTimeString;
}

function validateValues(_req, res, next) {
  const body = res.locals.body;

  const { reservation_date, reservation_time, people, status } = body;

  if (!Number.isInteger(people) || !(people > 0)) {
    return next({
      status: 400,
      message: 'people must be an integer that is greater than zero',
    });
  }

  if (!timeIsValid(reservation_time)) {
    return next({
      status: 400,
      message: 'reservation_time must be in HH:MM:SS format',
    });
  }

  if (!validator.isDate(reservation_date)) {
    return next({
      status: 400,
      message: 'reservation_date must be a valid date',
    });
  }

  if (dateIsTuesday(reservation_date)) {
    return next({
      status: 400,
      message: 'The restaurant is closed on Tuesdays',
    });
  }

  if (!isDateInFuture(reservation_date, reservation_time)) {
    return next({
      status: 400,
      message: `You are attempting to submit a reservation in the past. Only future reservations are allowed`,
    });
  }

  if (!reservationTimeIsValid(reservation_time)) {
    return next({
      status: 400,
      message: 'The reservation time must be between 10:30 AM and 9:30 PM',
    });
  }

  if (status === 'seated' || status === 'finished') {
    return next({
      status: 400,
      message:
        'Cannot create a reservation that has a status value of "seated" or "finished"',
    });
  }

  next();
}

async function reservationExists(req, res, next) {
  const { reservation_id } = req.params;
  const response = await service.read(reservation_id);

  if (!response) {
    return next({
      status: 404,
      message: `Reservation with ${reservation_id} does not exist`,
    });
  }
  res.locals.reservation = response;
  next();
}

function statusIsValid(_req, res, next) {
  const { status } = res.locals.body;

  const VALID_STATUSES = ['seated', 'finished', 'booked', 'cancelled'];

  if (!VALID_STATUSES.includes(status)) {
    return next({
      status: 400,
      message: `unknown status. must either be "booked", "seated", "finished", or "cancelled"`,
    });
  }
  next();
}

async function statusIsNotCurrentlyFinished(req, _res, next) {
  const { reservation_id } = req.params;
  const reservation = await service.read(reservation_id);

  if (reservation.status === 'finished') {
    return next({
      status: 400,
      message: 'a finished reservation cannot be updated',
    });
  }
  next();
}

function statusIsBooked(req, res, next) {
  const { status } = res.locals.reservation;

  if (status !== 'booked') {
    return next({
      status: 400,
      message: 'Only "booked" reservations may be edited',
    });
  }
  next();
}
// Validation ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
function passDownBodyToPipeline(req, res, next) {
  const body = req.body.data ?? req.body;
  res.locals.body = body;
  next();
}

async function list(req, res, next) {
  const { date, mobile_number } = req.query;

  let data = null;
  if (date) {
    data = await service.listReservationByDate(date);
  } else if (mobile_number) {
    data = await service.listReservationByMobileNumber(mobile_number);
  } else {
    return next({
      message:
        'A query string is required for this route. Please use either "reservations?date=YYYY-MM-DD" or "reservations?mobile_number=<phone number>"',
      status: 400,
    });
  }
  res.json({ data });
}

async function create(_req, res) {
  const body = res.locals.body;
  const createdReservation = await service.create(body);

  res.status(201).json({ data: createdReservation });
}

async function read(req, res, _next) {
  const { reservation_id } = req.params;

  const reservation = await service.read(reservation_id);
  res.json({ data: reservation });
}

async function updateStatus(req, res, _next) {
  const { reservation_id } = req.params;
  const { status } = res.locals.body;

  const data = await service.updateStatus(reservation_id, status);
  res.json({ data });
}

async function update(req, res, next) {
  const { reservation_id } = res.locals.reservation;
  const currentReservation = res.locals.reservation;
  const updatedReservation = res.locals.body;
  const mergedReservation = {
    ...currentReservation,
    ...updatedReservation,
  };
  const data = await service.update(reservation_id, mergedReservation);
  res.json({ data });
}
module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    passDownBodyToPipeline,
    reservationHasOnlyValidProperties,
    hasRequiredProperties,
    validateValues,
    asyncErrorBoundary(create),
  ],
  read: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(read)],

  updateStatus: [
    passDownBodyToPipeline,
    asyncErrorBoundary(reservationExists),
    statusIsValid,
    asyncErrorBoundary(statusIsNotCurrentlyFinished),
    asyncErrorBoundary(updateStatus),
  ],

  update: [
    passDownBodyToPipeline,
    asyncErrorBoundary(reservationExists),
    statusIsBooked,
    reservationHasOnlyValidProperties,
    hasRequiredProperties,
    validateValues,
    asyncErrorBoundary(update),
  ],
};
