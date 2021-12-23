// handler for not allowed http verbs on routes
function methodNotAllowed(req, _res, next) {
  next({
    status: 405,
    message: `${req.method} not allowed for ${req.originalUrl}`,
  });
}

module.exports = methodNotAllowed;
