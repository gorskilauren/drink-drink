import server from "./server";
import express from "express";
server().then((app: express.Server) =>
  app.listen(3000, () => console.log("listening on port 3000...")),
);
