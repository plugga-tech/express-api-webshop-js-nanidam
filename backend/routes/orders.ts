import express, { Request, Response } from "express";
import { API } from "../src/API.js";
import type { IOrder } from "../src/models/interfaces.js";

const router = express.Router();
const api = new API();

//Get all orders. Must have TOKEN-key
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

//Create order for specific user
router.post("/add", function (req: Request, res: Response) {
  api.addOrder(req, res);
});

//Get order for specific user. Must have TOKEN-key
router.post("/user", function (req: Request, res: Response) {
  if (req.body.token === process.env["TOKEN"]) {
    req.app.locals["ordersDB"]
      .collection("orders")
      .findOne({ user: req.body.user })
      .then((foundOrder: IOrder) => {
        if (foundOrder) {
          res.status(200).json(foundOrder);
        } else {
          res.status(404).json("Orders not found.");
        }
      });
  } else {
    res.status(401).json("Wrong or missing token.");
  }
});

export default router;
