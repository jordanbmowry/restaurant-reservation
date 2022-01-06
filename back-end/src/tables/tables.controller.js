const service = require('./tables.service');
const asyncErrorBoundary = require('../errors/asyncErrorBoundary');
const hasProperties = require('../errors/hasProperties');
const hasOnlyValidProperties = require('../errors/hasOnlyValidProperties');
// Validation ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
const VALID_PROPERTIES = ['table_name', 'capacity', 'reservation_id'];

const tableHasValidProperties = hasOnlyValidProperties(VALID_PROPERTIES);

const tableHasRequiredProperties = hasProperties('table_name', 'capacity');

function hasReservationId(_req, res, next) {
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
      status: 404,
      message: `Reservation with reservation_id: ${reservation_id} does not exist`,
    });
  }
  res.locals.reservation = response;
  next();
}

async function tableExists(req, res, next) {
  const { table_id } = req.params;
  const response = await service.read(table_id);
  if (!response) {
    next({
      status: 404,
      message: `Table with table_id: ${table_id} does not exist`,
    });
  }
  res.locals.table = response;
  next();
}

function reservationHasBookedStatus(_req, res, next) {
  const { reservation } = res.locals;
  if (reservation.status === 'booked') {
    return next();
  }
  next({ status: 400, message: 'The reservation has already been seated' });
}

function tableNameLengthIsValid(tableName) {
  return tableName.length > 1;
}

function capacityIsValid(capacity) {
  return Number.isInteger(capacity) && capacity > 0;
}

function bodyHasValidValues(_req, res, next) {
  const { capacity, table_name } = res.locals.body;

  if (!capacityIsValid(capacity)) {
    return next({
      status: 400,
      message: 'capacity must be an integer that is greater than zero',
    });
  }

  if (!tableNameLengthIsValid(table_name)) {
    return next({
      status: 400,
      message: 'table_name must have more than one character',
    });
  }
  next();
}

function tableIsLargeEnoughForParty(_req, res, next) {
  const {
    reservation: { people },
    table: { capacity, table_id },
  } = res.locals;

  if (people > capacity) {
    return next({
      status: 400,
      message: `Table with id: ${table_id} has a capacity of ${capacity} and cannot hold a group of ${people} people`,
    });
  }
  next();
}

function tableIsNotOccupied(_req, res, next) {
  const {
    table: { reservation_id, table_id },
  } = res.locals;
  if (reservation_id) {
    return next({
      status: 400,
      message: `Table with table_id ${table_id} is currently occupied`,
    });
  }
  next();
}

function tableIsOccupied(_req, res, next) {
  const {
    table: { reservation_id, table_id },
  } = res.locals;
  if (!reservation_id) {
    return next({
      status: 400,
      message: `Table with table_id ${table_id} is not occupied`,
    });
  }
  next();
}

function occupyTable(_req, res, next) {
  const {
    table,
    body: { reservation_id },
  } = res.locals;

  table.reservation_id = reservation_id;
  res.locals.reservation_id = reservation_id;
  res.locals.status = 'seated';
  if (table.reservation_id) {
    return next();
  }
  next({
    status: 400,
    message: `Table with id: ${table.table_id} could not be assigned reservation id ${reservation_id}  for some reason. Please contact backend engineer for assistance`,
  });
}

function emptyTable(_req, res, next) {
  const { table } = res.locals;
  res.locals.reservation_id = table.reservation_id;
  table.reservation_id = null;
  res.locals.status = 'finished';
  if (!table.reservation_id) {
    return next();
  }
  next({
    status: 400,
    message: `Table with id: ${table.table_id} could not remove reservation id ${table.reservation_id}  for some reason. Please contact backend engineer for assistance`,
  });
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

async function create(_req, res, _next) {
  const { body } = res.locals;

  const response = await service.create(body);
  res.status(201).json({ data: response });
}

async function update(_req, res, _next) {
  const { table, status, reservation_id } = res.locals;
  const data = await service.update(table, reservation_id, status);
  res.json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
  update: [
    passDownBodyToPipeline,
    hasReservationId,
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(tableExists),
    reservationHasBookedStatus,
    tableIsLargeEnoughForParty,
    tableIsNotOccupied,
    occupyTable,
    asyncErrorBoundary(update),
  ],
  create: [
    passDownBodyToPipeline,
    tableHasValidProperties,
    tableHasRequiredProperties,
    bodyHasValidValues,
    asyncErrorBoundary(create),
  ],
  deleteReservationId: [
    asyncErrorBoundary(tableExists),
    tableIsOccupied,
    emptyTable,
    asyncErrorBoundary(update),
  ],
};
