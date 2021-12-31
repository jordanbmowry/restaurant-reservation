function hasProperties(...properties) {
  return function (_req, res, next) {
    const body = res.locals.body;

    try {
      properties.forEach((property) => {
        if (!body[property]) {
          const error = new Error(`A '${property}' property is required.`);
          error.status = 400;
          throw error;
        }
      });
      next();
    } catch (error) {
      next(error);
    }
  };
}

module.exports = hasProperties;
