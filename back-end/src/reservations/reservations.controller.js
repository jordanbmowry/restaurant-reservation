const hasProperties = require('../errors/hasProperties');
const isPast = require('date-fns/isPast');
const service = require('./reservations.service');
const asyncErrorBoundary = require('../errors/asyncErrorBoundary');

const hasRequiredProperties = hasProperties(
  'first_name',
  'last_name',
  'mobile_number',
  'reservation_date',
  'reservation_time',
  'people'
);
// Validation Middleware

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

function hasOnlyValidProperties(req, res, next) {
  const { data = {} } = req.body;
  const invalidFields = Object.keys(data).filter(
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

function dateNotTuesday(dateString) {
  const date = new Date(dateString);
  return date.getUTCDay() !== 2;
}

function isDateInPast(dateString, timeString) {
  const reservationDate = dateString + 'T' + timeString;
  return isPast(new Date(reservationDate));
}

async function list(req, res) {
  const { date } = req.query;
  console.log(date);
  const data = await service.listReservationByDate(date);
  console.log(data);
  res.json({
    data,
  });
}

async function create(req, res) {
  console.log(req.body);
  const createdReservation = await service.createReservation(req.body);

  res.status(201).json({ data: createdReservation });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: asyncErrorBoundary(create),
};
