const getRandomNum = require('./getRandomNum');
const isValidCurrency = require('./isValidCurrency');
const isValidDecimal = require('./isValidDecimal');

module.exports = (accountNumber, currencyCode, balance) => {
  // validate parameters
  if (!Number.isInteger(accountNumber)) {
    return {
      isError: true,
      message: 'Invalid accountNumber.',
      referenceNumber: getRandomNum(),
    };
  } else if (!isValidCurrency(currencyCode)) {
    return {
      isError: true,
      message: 'Invalid currency.',
      referenceNumber: getRandomNum(),
    };
  } else if (!isValidDecimal(balance)) {
    return {
      isError: true,
      message: 'Invalid balance.',
      referenceNumber: getRandomNum(),
    };
  }

  function transferTo(receiver, amount) {
    if (amount < 0) {
      return {
        isError: true,
        message: 'Invalid amount.',
        referenceNumber: getRandomNum(),
      };
    } else if (amount > balance) {
      return {
        isError: true,
        message: 'Insufficient balance.',
        referenceNumber: getRandomNum(),
      };
    } else if (currencyCode !== receiver.currencyCode) {
      return {
        isError: true,
        message: 'Currency mismatch.',
        referenceNumber: getRandomNum(),
      };
    }

    // if there are no problems, make the transaction
    this.balance -= amount;
    receiver.balance += amount;
    return { isError: false, referenceNumber: getRandomNum() };
  }

  return {
    accountNumber,
    currencyCode,
    balance,
    transferTo,
  };
};
