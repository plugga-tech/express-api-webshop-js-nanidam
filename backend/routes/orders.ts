import express, { Request, Response } from "express";
import { API } from "../src/API.js";
import type { IOrder } from "../src/models/interfaces.js";

const router = express.Router();
const api = new API();

router.post("/add", function (req: Request, res: Response) {
  api.addOrder(req, res);
});

router.get("/all", function (req: Request, res: Response) {
  if (req.body.token === process.env["TOKEN"]!) {
    req.app.locals["ordersDB"]
      .collection("orders")
      .find()
      .project()
      .toArray()
      .then((results: IOrder[]) => {
        res.status(200).json(results);
      });
  } else {
    res.status(404).json("Can not get all orders");
  }
});

router.post("/user", function (req: Request, res: Response) {
  req.app.locals["ordersDB"]
    .collection("orders")
    .findOne({ user: req.body.user })
    .then((foundOrder: IOrder) => {
      if (foundOrder) {
        res.status(200).json(foundOrder);
      } else {
        res.status(404).json("Order not found.");
      }
    });
});

export default router;
