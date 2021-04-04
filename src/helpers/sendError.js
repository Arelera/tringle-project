const getRandomNum = require('./getRandomNum');
module.exports = (res, status, message) => {
  res.status(status).send({
    isError: true,
    message,
    referenceNumber: getRandomNum(),
  });
};
