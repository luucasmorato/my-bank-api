import { promises as fs } from "fs";

const { readFile, writeFile } = fs;

async function createAccount(newAccount) {
  const data = JSON.parse(await readFile(global.fileName));

  newAccount = {
    id: data.nextId++,
    name: newAccount.name,
    balance: newAccount.balance,
  };
  data.accounts.push(newAccount);

  await writeFile(global.fileName, JSON.stringify(data));
  return newAccount;
}

async function getAccounts() {
  const data = JSON.parse(await readFile(global.fileName));
  delete data.nextId;
  return data;
}

async function getAccount(id) {
  const data = JSON.parse(await readFile(global.fileName));
  const account = data.accounts.find((account) => account.id === parseInt(id));

  return account;
}

async function deleteAccount(id) {
  const data = JSON.parse(await readFile(global.fileName));

  data.accounts = data.accounts.filter(
    (account) => account.id !== parseInt(id)
  );

  await writeFile(global.fileName, JSON.stringify(data));
}

async function updateAccount(account) {
  const data = JSON.parse(await readFile(global.fileName));
  const index = data.accounts.findIndex((acc) => acc.id == account.id);

  if (index === -1) {
    throw new Error("Id not found.");
  }

  data.accounts[index].name = account.name;
  data.accounts[index].balance = account.balance;

  await writeFile(global.fileName, JSON.stringify(data));

  return data.accounts[index];
}

async function updateBalance(id, balance) {
  const data = JSON.parse(await readFile(global.fileName));
  const index = data.accounts.findIndex((acc) => acc.id == id);

  if (index === -1) {
    throw new Error("Id not found.");
  }

  data.accounts[index].balance = balance;
  await writeFile(global.fileName, JSON.stringify(data));

  return data.accounts[index];
}

export default {
  createAccount,
  getAccounts,
  getAccount,
  deleteAccount,
  updateAccount,
  updateBalance,
};
