import express, { Request, Response } from "express";
import { API } from "../src/API.js";
// import { ObjectId } from "mongodb";
import type { IProduct } from "../src/models/interfaces.js";

const router = express.Router();
const api = new API();

// Get products of specific category
router.get("/:id", (req, res) => {
  const id = req.params.id;
  console.log(id);
  req.app.locals["db"]
    .collection("products")
    .find({ category: id })
    .project()
    .toArray()
    .then((results: IProduct) => {
      if (results) {
        res.status(200).json(results);
      } else {
        res.status(404).json("Product not found");
      }
    });
});

// Get all products
router.get("/", (req, res) => {
  req.app.locals["db"]
    .collection("products")
    .find()
    .project()
    .toArray()
    .then((results: IProduct[]) => {
      if (results.length > 0) {
        res.status(200).json(results);
      } else {
        res.status(400).json("Products not found");
      }
    });
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
      if (result.length > 0) {
        res.status(200).json(result);
      } else {
        res.status(400).send("Could not get products of a specific category");
      }
    });
});

export default router;
