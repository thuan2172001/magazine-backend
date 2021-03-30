exports.unauthorized = (reason) => ({
  success: false,
  code: 401,
  reason: reason || 'AUTH.ERROR.NOT_LOGGED_IN',
});

exports.badRequest = (reason) => ({
  success: false,
  code: 400,
  reason: reason || 'BAD_REQUEST',
});

exports.notFound = (reason) => ({
  success: false,
  code: 404,
  reason: reason || 'NOT_FOUND',
});

exports.forbidden = (reason) => ({
  success: false,
  code: 403,
  reason: reason || 'FORBIDDEN',
});

exports.serverError = (reason) => ({
  success: false,
  code: 500,
  reason: reason || 'INTERNAL_SERVER_ERROR',
});

exports.tooMany = (reason) => ({
  success: false,
  code: 429,
  reason: reason || 'TOO_MANY_REQUESTS',
});

exports.success = (data) => ({
  success: true,
  code: 200,
  data,
});
