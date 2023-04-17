import express, { Request, Response } from "express";
import { API } from "../src/API.js";
import { ObjectId } from "mongodb";
import type { IProduct } from "../src/models/interfaces.js";

const router = express.Router();
const api = new API();

// Get all products or get specific product with id
router.get("/", (req, res) => {
  if (req.body.id) {
    req.app.locals["db"]
      .collection("products")
      .find({ _id: new ObjectId(req.body.id) })
      .project()
      .toArray()
      .then((results: IProduct) => {
        if (results) {
          res.status(200).json(results);
        } else {
          res.status(404).json("Product not found");
        }
      });
  } else {
    req.app.locals["db"]
      .collection("products")
      .find()
      .project()
      .toArray()
      .then((results: IProduct[]) => {
        if (results) {
          res.status(200).json(results);
        } else {
          res.status(400).json("Products not found");
        }
      });
  }
});

// Create product
router.post("/add", function (req: Request, res: Response) {
  if (req.body.token === "1234key1234") {
    api.addProduct(req);
    res.status(201).json("Token accepted - product added");
  } else {
    res.status(406).json("Something went wrong. Product not added");
  }
});

//Get all products of a category
router.get("/category", function (req: Request, res: Response) {
  const productCategory = req.body.category;

  req.app.locals["db"]
    .collection("products")
    .find({ category: productCategory })
    .toArray()
    .then((result: IProduct[]) => {
      res.status(200).json(result);
    });
});

export default router;
