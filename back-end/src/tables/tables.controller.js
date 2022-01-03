const service = require('./tables.service');
const asyncErrorBoundary = require('../errors/asyncErrorBoundary');
const hasProperties = require('../errors/hasProperties');
// Validation ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
function hasReservationId(req, res, next) {
  const body = res.locals.body;
  if (body.reservation_id) {
    return next();
  }
  next({
    status: 400,
    message: 'reservation_id is required',
  });
}

async function reservationExists(_req, res, next) {
  const { reservation_id } = res.locals.body;
  const response = await service.readReservation(reservation_id);

  if (!response) {
    return next({
      status: 400,
      message: `Reservation with reservation_id: ${reservation_id} does not exist`,
    });
  }
  res.locals.reservation = response;
  next();
}

async function tableExists(req, res, next) {
  const { table_id } = req.params;

  const response = await service.readReservation(table_id);

  if (!response) {
    next({
      status: 400,
      message: `Table with table_id: ${table_id} does not exist`,
    });
  }
  next();
}

function reservationHasBookedStatus(req, res, next) {
  const { reservation } = res.locals;
  if (reservation.status === 'booked') {
    return next();
  }
  next({ status: 400, message: 'The reservation has already been seated' });
}

// Validation ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
function passDownBodyToPipeline(req, res, next) {
  const body = req.body.data ?? req.body;
  res.locals.body = body;
  next();
}

async function list(_req, res, _next) {
  const tables = await service.list();
  res.json({ data: tables });
}

module.exports = {
  list: asyncErrorBoundary(list),
  update: [
    passDownBodyToPipeline,
    hasReservationId,
    asyncErrorBoundary(reservationExists),
    reservationHasBookedStatus,
    tableExists,
  ],
};
