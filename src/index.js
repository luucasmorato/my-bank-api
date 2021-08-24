import express from "express";
import accountsRouter from "./routes/account.routes.js";
import { promises as fs } from "fs";
import winston from "winston";
import cors from "cors";
import basicAuth from "express-basic-auth";

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

function getRole(username) {
  if (username == "admin") {
    return "admin";
  } else if (username == "lucas") {
    return "role";
  }
}

function authorize(...allowed) {
  const isAllowed = (role) => allowed.indexOf(role) > -1;

  return (req, res, next) => {
    if (req.auth.user) {
      const role = getRole(req.auth.user);
      if (isAllowed(role)) {
        next();
      } else {
        res.status(401).send("Role not allowed");
      }
    } else {
      res.status(403).send("User not found");
    }
  };
}

const app = express();
app.use(express.json());
app.use(cors());
app.use(
  basicAuth({
    authorizer: (username, password) => {
      const userMatches = basicAuth.safeCompare(username, "admin");
      const passwordMatches = basicAuth.safeCompare(password, "admin");
      return userMatches && passwordMatches;
    },
  })
);
app.use("/account", authorize("admin", "role"), accountsRouter);

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
