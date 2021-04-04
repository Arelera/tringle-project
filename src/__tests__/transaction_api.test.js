const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);

describe('GET /transactions', () => {
  test('Respons with a json array.', () => {
    return api
      .get('/transactions')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body)).toBeTruthy();
      });
  });
});

describe('POST /transactions', () => {
  // create 2 accounts before tests
  beforeAll(() => {
    return api
      .post('/accounts')
      .send({ accountNumber: 444, currencyCode: 'TRY', balance: 100 })
      .expect(201)
      .then((res) =>
        api
          .post('/accounts')
          .send({ accountNumber: 555, currencyCode: 'TRY', balance: 60 })
          .expect(201)
      );
  });

  test('Can make a transaction between 2 accounts.', () => {
    return api
      .post('/transactions')
      .send({
        senderAccountNumber: 444,
        receiverAccountNumber: 555,
        amount: 20,
      })
      .expect(201)
      .then(({ body }) => {
        expect(body.isError).toBeFalsy();
      });
  });

  test('Responds with a 400 for non existent sender/receiver account numbers', () => {
    return api
      .post('/transactions')
      .send({
        senderAccountNumber: 89651,
        receiverAccountNumber: 555,
        amount: 20,
      })
      .expect(400)
      .then((res) =>
        api
          .post('/transaction')
          .send({
            senderAccountNumber: 89651,
            receiverAccountNumber: 555,
            amount: 20,
          })
          .expect(404)
      );
  });

  test("Doesn't accepts transactions between different currencies.", () => {
    return api
      .post('/accounts')
      .send({ accountNumber: 666, currencyCode: 'EUR', balance: 100 })
      .expect(201)
      .then((res) => {
        return api
          .post('/transactions')
          .send({
            senderAccountNumber: 555,
            receiverAccountNumber: 666,
            amount: 20,
          })
          .expect(400);
      });
  });

  test("Doesn't accepts transactions exceeding sender balance.", () => {
    return api
      .post('/transactions')
      .send({
        senderAccountNumber: 444,
        receiverAccountNumber: 555,
        amount: 50000,
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.isError).toBeTruthy();
      });
  });
});
