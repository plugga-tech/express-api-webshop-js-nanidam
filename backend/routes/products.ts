import express, { Request, Response } from "express";
import { API } from "../src/API.js";
import { ObjectId } from "mongodb";
import type { IProduct } from "../src/models/interfaces.js";

const router = express.Router();
const api = new API();

// If "id" exist -> show product, otherwise get ALL products
router.get("/", (req, res) => {
  const DB = req.app.locals["productsDB"].collection("products");
  console.log(req.body);
  if (req.body.id) {
    DB.findOne({ _id: new ObjectId(req.body.id) }).then((result: IProduct) => {
      // console.log(result);
      if (result) {
        res.status(200).json(result);
      } else {
        res.status(404).json("Product not found");
      }
    });
  } else {
    DB.find()
      .toArray()
      .then((result: IProduct[]) => {
        console.log(result);
        if (result) {
          res.status(200).json(result);
        } else {
          res.status(404).json("Product not found");
        }
      });
  }
});

// Create product
router.post("/add", function (req: Request, res: Response) {
  if (req.body.token === "1234key1234") {
    api.addProduct(req, res);
    res.status(201).json("Token accepted - product added");
  } else {
    res.status(406).json("Something went wrong. Product not added");
  }
});

//Get all products of a category
router.get("/category", function (req: Request, res: Response) {
  const productCategory = req.body.category;

  if (productCategory < 5 || productCategory > 1) {
    req.app.locals["productsDB"]
      .collection("products")
      .find({ category: productCategory })
      .toArray()
      .then((result: IProduct[]) => {
        res.status(200).json(result);
      });
  } else {
    res.status(401).json("Category not found");
  }
});

export default router;
