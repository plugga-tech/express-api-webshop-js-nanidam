import express, { Request, Response } from "express";
import { API } from "../src/API.js";
import { ObjectId } from "mongodb";
import type { IProduct } from "../src/models/interfaces.js";

const router = express.Router();
const api = new API();

// If "id" exist -> show product, otherwise get ALL products
router.get("/", function (req, res) {
  if (req.body.id) {
    req.app.locals["productsDB"]
      .collection("products")
      .findOne({ _id: new ObjectId(req.body.id) })
      .then((result: IProduct) => {
        console.log(result);

        res.send(result);
      });
  } else {
    req.app.locals["productsDB"]
      .collection("products")
      .find()
      .toArray()
      .then((results: IProduct[]) => {
        console.log(results);
        res.send(results);
      });
  }
});

// Create product
router.post("/add", function (req: Request, res: Response) {
  if (req.body.token === "1234key1234") {
    api.addProduct(req);
    res.status(200).json("Token accepted - product added");
  } else {
    res.status(401).json("Wrong token");
  }
});

export default router;
