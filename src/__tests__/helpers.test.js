const {
  getRandomNum,
  getNewAccount,
  isValidCurrency,
  isValidDecimal,
} = require('../helpers');

describe('Helper methods', () => {
  test('getRandomNum gives an integer.', () => {
    expect(Number.isInteger(getRandomNum())).toBeTruthy();
  });

  test('isValidCurrency', () => {
    expect(isValidCurrency('GBP')).toBeFalsy();
    expect(isValidCurrency('TRY')).toBeTruthy();
    expect(isValidCurrency('USD')).toBeTruthy();
    expect(isValidCurrency('EUR')).toBeTruthy();
  });

  test('isValidDecimal', () => {
    expect(isValidDecimal(100.123)).toBeFalsy();
    expect(isValidDecimal(100.12)).toBeTruthy();
  });

  describe('getNewAccount', () => {
    test('Only accepts integer account numbers', () => {
      expect(getNewAccount('123', 'TRY', 100).isError).toBeTruthy();
      expect(getNewAccount('asdasd', 'TRY', 100).isError).toBeTruthy();
      expect(getNewAccount(123, 'TRY', 100).isError).toBeUndefined();
    });

    test('Only accepts TRY, USD and EUR currencies.', () => {});
    expect(getNewAccount(1, 'asd', 100).isError).toBeTruthy();
    expect(getNewAccount(1, 'TRY', 100).isError).toBeUndefined();
    expect(getNewAccount(1, 'USD', 100).isError).toBeUndefined();
    expect(getNewAccount(1, 'EUR', 100).isError).toBeUndefined();

    test('Can transfer money between accounts.', () => {
      const account1 = getNewAccount(123, 'TRY', 100);
      const account2 = getNewAccount(123, 'TRY', 20);
      account1.transferTo(account2, 50);

      expect(account1.balance).toBe(50);
      expect(account2.balance).toBe(70);
    });

    test("Doesn't allow transfers with negative amount or that exceed the senders balance.", () => {
      const account1 = getNewAccount(123, 'TRY', 100);
      const account2 = getNewAccount(123, 'TRY', 20);

      const transactionResult = account1.transferTo(account2, 500);
      expect(transactionResult.isError).toBeTruthy();
      expect(account1.balance).toBe(100);
      expect(account2.balance).toBe(20);
    });
  });
});
