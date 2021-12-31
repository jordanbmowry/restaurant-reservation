const hasProperties = require('../errors/hasProperties');
const isPast = require('date-fns/isPast');
const service = require('./reservations.service');
const asyncErrorBoundary = require('../errors/asyncErrorBoundary');
const validator = require('validator');
// Validation Middleware
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
];

function hasOnlyValidProperties(_req, res, next) {
  const body = res.locals.body;

  const invalidFields = Object.keys(body).filter(
    (field) => !VALID_PROPERTIES.includes(field)
  );
  if (invalidFields.length) {
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(', ')}`,
    });
  }
  next();
}

function dateIsTuesday(dateString) {
  const date = new Date(dateString);
  return date.getUTCDay() === 2;
}

function isDateInFuture(dateString, timeString) {
  const reservationDate = dateString + 'T' + timeString;
  return validator.isAfter(reservationDate);
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

  const { reservation_date, reservation_time, people } = body;

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
      message: "'reservation_date' field: restaurant is closed on tuesday",
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

  next();
}

function passDownBodyToPipeline(req, res, next) {
  const body = req.body.data ?? req.body;
  res.locals.body = body;
  next();
}

async function list(req, res) {
  const { date } = req.query;
  const data = await service.listReservationByDate(date);
  res.json({
    data,
  });
}

async function create(_req, res) {
  const body = res.locals.body;
  console.log(typeof body.people);
  const createdReservation = await service.createReservation(body);

  res.status(201).json({ data: createdReservation });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    passDownBodyToPipeline,
    hasOnlyValidProperties,
    hasRequiredProperties,
    validateValues,
    asyncErrorBoundary(create),
  ],
};
