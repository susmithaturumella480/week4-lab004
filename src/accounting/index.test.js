const {
  readBalance,
  writeBalance,
  displayBalance,
  creditAccount,
  debitAccount,
  resetBalance,
} = require('./index');

describe('Accounting app business logic', () => {
  beforeEach(() => {
    resetBalance();
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('TC-001: initial account balance is 1000.00', () => {
    expect(readBalance()).toBe(1000.0);
  });

  test('TC-002: view current balance with no prior transactions', () => {
    displayBalance();
    expect(console.log).toHaveBeenCalledWith('Current balance: 1000.00');
  });

  test('TC-003: credit account with valid amount', () => {
    creditAccount(500.0);
    expect(readBalance()).toBe(1500.0);
    expect(console.log).toHaveBeenCalledWith('Amount credited. New balance: 1500.00');
  });

  test('TC-004: credit account with small amount 1.00', () => {
    creditAccount(1.0);
    expect(readBalance()).toBe(1001.0);
  });

  test('TC-005: credit account with large amount 9999.99', () => {
    creditAccount(9999.99);
    expect(readBalance()).toBeCloseTo(10999.99, 2);
  });

  test('TC-006: multiple sequential credits', () => {
    creditAccount(100.0);
    expect(readBalance()).toBe(1100.0);
    creditAccount(200.0);
    expect(readBalance()).toBe(1300.0);
  });

  test('TC-007: debit account with sufficient funds', () => {
    debitAccount(250.0);
    expect(readBalance()).toBe(750.0);
    expect(console.log).toHaveBeenCalledWith('Amount debited. New balance: 750.00');
  });

  test('TC-008: debit account with exact balance (1000.00)', () => {
    debitAccount(1000.0);
    expect(readBalance()).toBe(0.0);
  });

  test('TC-009: debit account with insufficient funds', () => {
    writeBalance(500.0);
    debitAccount(600.0);
    expect(readBalance()).toBe(500.0);
    expect(console.log).toHaveBeenCalledWith('Insufficient funds for this debit.');
  });

  test('TC-010: failed debit does not modify balance', () => {
    writeBalance(100.0);
    debitAccount(150.0);
    expect(readBalance()).toBe(100.0);
  });

  test('TC-011: multiple sequential debits', () => {
    debitAccount(100.0); // 900
    expect(readBalance()).toBe(900.0);
    debitAccount(200.0); // 700
    expect(readBalance()).toBe(700.0);
    debitAccount(300.0); // 400
    expect(readBalance()).toBe(400.0);
  });

  test('TC-012: mixed credits and debits', () => {
    creditAccount(500.0); // 1500
    debitAccount(300.0); // 1200
    creditAccount(200.0); // 1400
    expect(readBalance()).toBe(1400.0);
  });

  test('TC-020: amount decimal precision', () => {
    creditAccount(0.5);
    expect(readBalance()).toBe(1000.5);
  });

  test('TC-024: credit zero amount leaves balance unchanged', () => {
    creditAccount(0.0);
    expect(readBalance()).toBe(1000.0);
  });

  test('TC-025: debit zero amount leaves balance unchanged', () => {
    debitAccount(0.0);
    expect(readBalance()).toBe(1000.0);
  });
});
