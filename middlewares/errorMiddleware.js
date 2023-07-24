const errorResponse = require("../utils/errorResponses");

const errorHandler = (err, req, res, next) => {
  err.message = err.message;

  //mongoose cast error

  if (err.name == "castError") {
    const message = "Resource error";
    err = new errorResponse(message, 404);
  }

  //mongoose Duplicate error
  if (err.code == 11000) {
    const message = "Duplicate key";
    err = new errorResponse(message, 400);
  }

  //mongoose Duplicate error
  if (err.name == "ValidationError") {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new errorResponse(message, 400);
    res.status(err.statusCode || 500).json({
      status: 0,
      error: error.message || "server error",
    });
  }
};
module.exports = errorHandler;
