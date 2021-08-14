import { promises as fs } from "fs";

const { readFile, writeFile } = fs;

async function getAccounts() {
  const data = JSON.parse(await readFile(global.fileName));
  return data.accounts;
}

async function getAccount(id) {
  const accounts = await getAccounts();
  const account = accounts.find((account) => account.id === parseInt(id));

  if (account) {
    return account;
  }
  throw new Error("Id not found.");
}

async function insertAccount(newAccount) {
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

export default {
  getAccounts,
  getAccount,
  insertAccount,
  deleteAccount,
  updateAccount,
};
