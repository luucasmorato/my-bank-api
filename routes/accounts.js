import express from "express";
import { promises as fs } from "fs";

const router = express.Router();
const { readFile, writeFile } = fs;

router.post("/", async (req, res, next) => {
  try {
    let newAccount = req.body;
    const data = JSON.parse(await readFile(global.fileName));

    newAccount = {
      id: data.nextId++,
      ...newAccount,
    };
    data.accounts.push(newAccount);

    await writeFile(global.fileName, JSON.stringify(data));
    res.send(newAccount);
  } catch (err) {
    next(err);
  }
});

router.get("/", async (_req, res, next) => {
  try {
    const data = JSON.parse(await readFile(global.fileName));
    delete data.nextId;

    res.send(data);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = JSON.parse(await readFile(global.fileName));

    const account = data.accounts.find(
      (account) => account.id === parseInt(id)
    );

    res.send(account);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = JSON.parse(await readFile(global.fileName));

    data.accounts = data.accounts.filter(
      (account) => account.id !== parseInt(id)
    );

    await writeFile(global.fileName, JSON.stringify(data));
    res.end();
  } catch (err) {
    next(err);
  }
});

router.put("/", async (req, res, next) => {
  try {
    const account = req.body;

    const data = JSON.parse(await readFile(global.fileName));
    const index = data.accounts.findIndex((acc) => acc.id == account.id);

    data.accounts[index] = account;

    await writeFile(global.fileName, JSON.stringify(data));
    res.send(account);
  } catch (err) {
    next(err);
  }
});

router.patch("/updateBalance", async (req, res, next) => {
  try {
    const { id, balance } = req.body;

    const data = JSON.parse(await readFile(global.fileName));
    const index = data.accounts.findIndex((acc) => acc.id == id);

    data.accounts[index].balance = balance;

    await writeFile(global.fileName, JSON.stringify(data));
    res.send(data.accounts[index]);
  } catch (err) {
    next(err);
  }
});

router.use((err, _req, res, _next) => {
  console.log(err);
  res.status(400).send({ error: err.message });
});

export default router;
