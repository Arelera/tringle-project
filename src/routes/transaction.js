const router = require('express').Router();
const { getRandomNum, sendError, isValidDecimal } = require('../helpers');
const { accounts, transactions } = require('../database');

// get a list of money transactions
router.get('/', async (req, res) => {
  res.status(200).send(transactions);
});

// create a money transaction
router.post('/', async (req, res) => {
  const transaction = req.body;

  if (!accounts[transaction.senderAccountNumber]) {
    return sendError(res, 400, "Sender doesn't exist.");
  } else if (!accounts[transaction.receiverAccountNumber]) {
    return sendError(res, 400, "Receiver doesn't exist.");
  } else if (!isValidDecimal(transaction.amount)) {
    return sendError(res, 400, 'Invalid amount.');
  }
  const sender = accounts[transaction.senderAccountNumber];
  const receiver = accounts[transaction.receiverAccountNumber];

  const transactionResult = sender.transferTo(receiver, transaction.amount);
  if (transactionResult.isError) {
    return res.status(400).send(transactionResult);
  }

  const referenceNumber = getRandomNum();
  transactions.push({ ...transaction, referenceNumber });

  res.status(201).send({
    isError: false,
    referenceNumber,
  });
});

module.exports = router;
