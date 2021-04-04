const router = require('express').Router();
const { sendError, getRandomNum, getNewAccount } = require('../helpers/index');
const { accounts } = require('../database');

// get a list of accounts
router.get('/', (req, res) => {
  res.send(Object.values(accounts));
});

// create an account
router.post('/', (req, res) => {
  const { accountNumber, currencyCode, balance } = req.body;

  if (accounts[accountNumber]) {
    return sendError(res, 409, 'Duplicate account number.');
  }

  const newAccount = getNewAccount(accountNumber, currencyCode, balance);
  if (newAccount.isError) {
    return res.status(400).send(newAccount);
  }

  accounts[accountNumber] = getNewAccount(accountNumber, currencyCode, balance);
  res.status(201).send({
    isError: false,
    referenceNumber: getRandomNum(),
  });
});

module.exports = router;
