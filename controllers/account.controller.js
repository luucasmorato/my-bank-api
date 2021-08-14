import { promises as fs } from "fs";

const { readFile, writeFile } = fs;

async function createAccount(req, res, next) {
  try {
    let newAccount = req.body;

    if (!newAccount.name || newAccount.balance == null) {
      throw new Error("Name and balance is required.");
    }

    const data = JSON.parse(await readFile(global.fileName));

    newAccount = {
      id: data.nextId++,
      name: newAccount.name,
      balance: newAccount.balance,
    };
    data.accounts.push(newAccount);

    await writeFile(global.fileName, JSON.stringify(data));
    res.send(newAccount);

    logger.info(`POST /account - ${JSON.stringify(account)}`);
  } catch (err) {
    next(err);
  }
}

async function getAccounts(_req, res, next) {
  try {
    const data = JSON.parse(await readFile(global.fileName));
    delete data.nextId;

    res.send(data);
    logger.info(`GET /account`);
  } catch (err) {
    next(err);
  }
}

async function getAccount(req, res, next) {
  try {
    const { id } = req.params;
    const data = JSON.parse(await readFile(global.fileName));

    const account = data.accounts.find(
      (account) => account.id === parseInt(id)
    );

    res.send(account);
    logger.info(`GET /account/:id`);
  } catch (err) {
    next(err);
  }
}

async function deleteAccount(req, res, next) {
  try {
    const { id } = req.params;
    const data = JSON.parse(await readFile(global.fileName));

    data.accounts = data.accounts.filter(
      (account) => account.id !== parseInt(id)
    );

    await writeFile(global.fileName, JSON.stringify(data));
    res.end();

    logger.info(`DELETE /account/:id - ${req.params.id}`);
  } catch (err) {
    next(err);
  }
}

async function updateAccount(req, res, next) {
  try {
    const account = req.body;

    if (!account.id || !account.name || account.balance == null) {
      throw new Error("Id, name and balance is required.");
    }

    const data = JSON.parse(await readFile(global.fileName));
    const index = data.accounts.findIndex((acc) => acc.id == account.id);

    if (index === -1) {
      throw new Error("Id not found.");
    }

    data.accounts[index].name = account.name;
    data.accounts[index].balance = account.balance;

    await writeFile(global.fileName, JSON.stringify(data));
    res.send(account);

    logger.info(`PUT /account - ${JSON.stringify(account)}`);
  } catch (err) {
    next(err);
  }
}

async function updateBalance(req, res, next) {
  try {
    const { id, balance } = req.body;

    if (!id || balance == null) {
      throw new Error("Id and balance is required.");
    }

    const data = JSON.parse(await readFile(global.fileName));
    const index = data.accounts.findIndex((acc) => acc.id == id);

    if (index === -1) {
      throw new Error("Id not found.");
    }

    data.accounts[index].balance = balance;

    await writeFile(global.fileName, JSON.stringify(data));
    res.send(data.accounts[index]);

    logger.info(`PATCH /account/updateBalance - ${JSON.stringify(account)}`);
  } catch (err) {
    next(err);
  }
}

export default {
  createAccount,
  getAccounts,
  getAccount,
  deleteAccount,
  updateAccount,
  updateBalance,
};
