const service = require('./tables.service');
const asyncErrorBoundary = require('../errors/asyncErrorBoundary');
const hasProperties = require('../errors/hasProperties');

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
};
