const errorMiddleware = (
  err,
  req,
  res,
  next
) => {
  console.error(err);

  let statusCode =
    err.statusCode || 500;

  let message =
    err.message ||
    "Internal server error.";

  // Mongoose validation error
  if (
    err.name ===
    "ValidationError"
  ) {
    statusCode = 400;

    const messages = Object.values(
      err.errors
    ).map(
      (error) => error.message
    );

    message = messages.join(", ");
  }

  // Invalid MongoDB ObjectId
  if (
    err.name ===
    "CastError"
  ) {
    statusCode = 400;
    message =
      "Invalid ID format.";
  }

  // Duplicate MongoDB key
  if (err.code === 11000) {
    statusCode = 400;

    const fields =
      Object.keys(
        err.keyPattern || {}
      );

    message = `${fields.join(
      ", "
    )} already exists.`;
  }

  // JWT errors
  if (
    err.name ===
    "JsonWebTokenError"
  ) {
    statusCode = 401;
    message =
      "Invalid authentication token.";
  }

  if (
    err.name ===
    "TokenExpiredError"
  ) {
    statusCode = 401;
    message =
      "Authentication token has expired.";
  }

  // Multer errors
  if (
    err.name === "MulterError"
  ) {
    statusCode = 400;

    if (
      err.code ===
      "LIMIT_FILE_SIZE"
    ) {
      message =
        "File size is too large. Maximum size is 5MB.";
    } else {
      message =
        err.message;
    }
  }

  res.status(statusCode).json({
    success: false,
    message,

    ...(process.env.NODE_ENV ===
      "development" && {
      stack: err.stack,
    }),
  });
};

module.exports =
  errorMiddleware;