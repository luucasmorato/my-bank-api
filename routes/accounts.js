import express from "express";
import { promises as fs } from "fs";

const router = express.Router();
const { readFile, writeFile } = fs;

router.post("/", async (req, res) => {
  try {
    let newAccount = req.body;
    const data = JSON.parse(await readFile("accounts.json"));

    newAccount = {
      id: data.nextId++,
      ...newAccount,
    };
    data.accounts.push(newAccount);

    await writeFile("accounts.json", JSON.stringify(data));
    res.send(newAccount);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

export default router;
