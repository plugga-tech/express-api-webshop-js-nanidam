import express, { Request, Response } from "express";
import { API } from "../src/API.js";
import type { IProduct } from "../src/models/interfaces.js";
// import type { IUser } from "../src/models/interfaces.js";

const router = express.Router();
const api = new API();

// Get all products
router.get("/", function (req, res) {
  req.app.locals["productsDB"]
    .collection("products")
    .find()
    .toArray()
    .then((results: IProduct[]) => {
      console.log(results);
      res.send(results);
    });
});

router.post("/add", function (req: Request, res: Response) {
  if (req.body.token === "1234key1234") {
    api.addProduct(req);
    res.status(200).json("Token accepted - product added");
  } else {
    res.status(401).json("Wrong token");
  }
});

export default router;
