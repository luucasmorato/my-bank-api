import express from "express";
import accountsRouter from "./routes/accounts.js";
import { promises as fs } from "fs";

const app = express();
app.use(express.json());
app.use("/account", accountsRouter);

global.fileName = "accounts.json";
const { readFile, writeFile } = fs;

app.listen(3333, async () => {
  try {
    await readFile(global.fileName);
  } catch (err) {
    const initialJson = {
      nextId: 1,
      accounts: [],
    };

    writeFile(global.fileName, JSON.stringify(initialJson))
      .then(() => console.log("json file created"))
      .catch((err) => console.log(`error: ${err}`));
  }
});
