import express, { Request, Response } from "express";
import { API } from "../src/API.js";
import type { IOrder } from "../src/models/interfaces.js";

const router = express.Router();
const api = new API();

router.post("/add", function (req: Request, res: Response) {
  api.addOrder(req, res);
  res.send("Order added!");
});

router.get("/all", function (req: Request, res: Response) {
  req.app.locals["ordersDB"]
    .collection("orders")
    .find()
    .project()
    .toArray()
    .then((results: IOrder[]) => {
      res.send(results);
    });
});

export default router;
