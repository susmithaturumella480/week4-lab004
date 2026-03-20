#!/usr/bin/env node

// Node.js port of the COBOL Account Management System (main/operations/data programs)
// Preserves menu options, data flow, and business logic.

const readline = require('readline');

let storageBalance = 1000.0; // initial balance per data.cob

function readBalance() {
  return storageBalance;
}

function writeBalance(newBalance) {
  storageBalance = Number(newBalance.toFixed(2));
}

function displayBalance() {
  const current = readBalance();
  console.log(`Current balance: ${current.toFixed(2)}`);
}

function creditAccount(amount) {
  const current = readBalance();
  const updated = current + Number(amount);
  writeBalance(updated);
  console.log(`Amount credited. New balance: ${readBalance().toFixed(2)}`);
}

function debitAccount(amount) {
  const current = readBalance();
  if (current >= Number(amount)) {
    const updated = current - Number(amount);
    writeBalance(updated);
    console.log(`Amount debited. New balance: ${readBalance().toFixed(2)}`);
  } else {
    console.log('Insufficient funds for this debit.');
  }
}

async function prompt(question, rl) {
  return new Promise((resolve) => rl.question(question, resolve));
}

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  let continueFlag = true;

  while (continueFlag) {
    console.log('--------------------------------');
    console.log('Account Management System');
    console.log('1. View Balance');
    console.log('2. Credit Account');
    console.log('3. Debit Account');
    console.log('4. Exit');
    console.log('--------------------------------');

    const choice = await prompt('Enter your choice (1-4): ', rl);

    switch (choice.trim()) {
      case '1':
        displayBalance();
        break;
      case '2': {
        const rawAmt = await prompt('Enter credit amount: ', rl);
        const amount = Number(rawAmt);
        if (Number.isFinite(amount)) {
          creditAccount(amount);
        } else {
          console.log('Invalid amount. Please enter a numeric value.');
        }
        break;
      }
      case '3': {
        const rawAmt = await prompt('Enter debit amount: ', rl);
        const amount = Number(rawAmt);
        if (Number.isFinite(amount)) {
          debitAccount(amount);
        } else {
          console.log('Invalid amount. Please enter a numeric value.');
        }
        break;
      }
      case '4':
        continueFlag = false;
        console.log('Exiting the program. Goodbye!');
        break;
      default:
        console.log('Invalid choice, please select 1-4.');
    }
  }

  rl.close();
}

function resetBalance() {
  storageBalance = 1000.0;
}

module.exports = {
  readBalance,
  writeBalance,
  displayBalance,
  creditAccount,
  debitAccount,
  resetBalance,
  main,
};

if (require.main === module) {
  main().catch((err) => {
    console.error('Unhandled error:', err);
    process.exit(1);
  });
}
