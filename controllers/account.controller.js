import { promises as fs } from "fs";
import AccountService from "../services/account.service.js";

const { readFile, writeFile } = fs;

async function createAccount(req, res, next) {
  try {
    let newAccount = req.body;

    if (!newAccount.name || newAccount.balance == null) {
      throw new Error("Name and balance is required.");
    }

    newAccount = await AccountService.createAccount(newAccount);
    res.send(newAccount);

    logger.info(`POST /account - ${JSON.stringify(newAccount)}`);
  } catch (err) {
    next(err);
  }
}

async function getAccounts(_req, res, next) {
  try {
    res.send(await AccountService.getAccounts());
    logger.info(`GET /account`);
  } catch (err) {
    next(err);
  }
}

async function getAccount(req, res, next) {
  try {
    const { id } = req.params;
    res.send(await AccountService.getAccount(id));

    logger.info(`GET /account/:id`);
  } catch (err) {
    next(err);
  }
}

async function deleteAccount(req, res, next) {
  try {
    const { id } = req.params;
    await AccountService.deleteAccount(id);
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

    res.send(await AccountService.updateAccount(account));

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
    res.send(await AccountService.updateAccount(id, balance));

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
