const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);

describe('GET /accounts', () => {
  test('Responds with a json array.', () => {
    return api
      .get('/accounts')
      .expect('Content-Type', /json/)
      .then(({ body }) => {
        expect(Array.isArray(body)).toBeTruthy();
      });
  });
});

describe('POST /accounts', () => {
  test('Responds with json.', () => {
    return api
      .post('/accounts')
      .send({ accountNumber: 111, currencyCode: 'TRY', balance: 100 })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201);
  });

  test('Can create an account.', () => {
    return api
      .post('/accounts')
      .send({ accountNumber: 222, currencyCode: 'TRY', balance: 100 })
      .expect(201)
      .then(({ body }) => {
        expect(body).toHaveProperty('isError', false);
        expect(Number.isInteger(body.referenceNumber)).toBe(true);
      });
  });

  test('Gives 409 for duplicate account numbers.', () => {
    return api
      .post('/accounts')
      .send({ accountNumber: 333, currencyCode: 'TRY', balance: 100 })
      .expect(201)
      .then((res) =>
        api
          .post('/accounts')
          .send({ accountNumber: 333, currencyCode: 'TRY', balance: 100 })
          .expect(409)
      );
  });

  describe('Gives 400 for invalid parameters.', () => {
    test('Invalid account number.', () => {
      return api
        .post('/accounts')
        .send({ accountNumber: 'asd', currencyCode: 'TRY', balance: 100 })
        .expect(400);
    });
    test('Invalid currency code.', () => {
      return api
        .post('/accounts')
        .send({ accountNumber: 123, currencyCode: 'GBP', balance: 100 })
        .expect(400);
    });
    test('Invalid balance.', () => {
      return api
        .post('/accounts')
        .send({ accountNumber: 123, currencyCode: 'TRY', balance: 123.4567 })
        .expect(400);
    });
  });
});
