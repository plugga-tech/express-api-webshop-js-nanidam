import express, { Request, Response } from "express";
import { API } from "../src/API.js";
import type { ICategory } from "../src/models/interfaces.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const api = new API();

// Get all categories
router.get("/", function (req: Request, res: Response) {
  req.app.locals["categoriesDB"]
    .collection("categories")
    .find()
    .project()
    .toArray()
    .then((result: ICategory[]) => {
      if (result) {
        res.status(202).json(result);
      } else {
        res.status(404).json("Category not found.");
      }
    });
});

// Create category. Must have TOKEN-key
router.post("/add", function (req: Request, res: Response) {
  if (req.body.token === process.env["TOKEN"]!) {
    api.addCategory(req, res);
  }
});

export default router;
