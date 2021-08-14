import express from "express";
import accountsRouter from "./src/routes/account.routes.js";
import { promises as fs } from "fs";
import winston from "winston";
import cors from "cors";

global.fileName = "accounts.json";

const { combine, timestamp, label, printf } = winston.format;
const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

global.logger = winston.createLogger({
  level: "silly",
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "my-bank-api.log" }),
  ],
  format: combine(label({ label: "my-bank-api" }), timestamp(), myFormat),
});

const { readFile, writeFile } = fs;

const app = express();
app.use(express.json());
app.use("/account", accountsRouter);

app.use(cors());

app.listen(3333, async () => {
  try {
    await readFile(global.fileName);
    logger.info("API Started!");
  } catch (err) {
    const initialJson = {
      nextId: 1,
      accounts: [],
    };

    writeFile(global.fileName, JSON.stringify(initialJson))
      .then(() => logger.info("json file created"))
      .catch((err) => logger.error(`error: ${err}`));
  }
});
