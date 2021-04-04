const express = require('express');
const app = express();
const accountRouter = require('./routes/account');
const transactionRouter = require('./routes/transaction');

app.use(express.json());

// routes
app.use('/accounts', accountRouter);
app.use('/transactions', transactionRouter);

module.exports = app;
