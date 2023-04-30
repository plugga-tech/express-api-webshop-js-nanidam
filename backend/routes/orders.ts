import express, { Request, Response } from "express";
import { API } from "../src/API.js";
import type { IOrder } from "../src/models/interfaces.js";

const router = express.Router();
const api = new API();

// G: Get all order without key
// router.get("/all", (req, res) => {
//   req.app.locals["db"]
//     .collection("nani-dam-orders")
//     .find()
//     .project()
//     .toArray()
//     .then((results: IOrder[]) => {
//       if (results.length > 0) {
//         res.json(results);
//       } else {
//         res.status(400).json("Could not get orders.");
//       }
//     });
// });

// VG: Get all orders. Must have TOKEN-key
router.get("/all", function (req: Request, res: Response) {
  const token = req.body.token;
  const validToken = process.env["TOKEN"];

  if (token === validToken) {
    req.app.locals["db"]
      .collection("nani-dam-orders")
      .find()
      .project()
      .toArray()
      .then((results: IOrder[]) => {
        if (results.length > 0) {
          res.status(200).json(results);
        } else {
          res.status(404).json("Can not get all orders");
        }
      });
  } else {
    res.status(401).json("Unauthorized");
  }
});

//Create order for specific user
router.post("/add", function (req: Request, res: Response) {
  api.addOrder(req, res);
});

//Get order for specific user. Must have TOKEN-key
router.post("/user", function (req: Request, res: Response) {
  if (req.body.token === process.env["TOKEN"]) {
    req.app.locals["db"]
      .collection("nani-dam-orders")
      .find({ user: req.body.user })
      .toArray()
      .then((orders: IOrder[]) => {
        if (orders.length > 0) {
          res.status(200).json(orders);
        } else {
          res.status(404).json("Orders not found.");
        }
      });
  } else {
    res.status(401).json("Wrong or missing token.");
  }
});

export default router;
