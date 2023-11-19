import express from "express";
import dotenv from "dotenv";

dotenv.config();

export default async (): express.Server => {
  const server = express();

  server.get("*", async (req, res) => {
    try {
      res.sendFile(`${__dirname}/public/index.html`);
    } catch (err) {
      res.status(500).send("Something went wrong :(");
    }
  });
  return server;
};
