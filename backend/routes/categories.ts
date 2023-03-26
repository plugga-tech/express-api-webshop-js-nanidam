import express, { Request, Response } from "express";
import { API } from "../src/API.js";

const router = express.Router();
const api = new API();

router.get("/", function (req: Request, res: Response) {
  req.app.locals["categoriesDB"]
    .collection("categories")
    .find()
    .project()
    .toArray()
    .then((result: any) => {
      if (result) {
        res.status(200).json(result);
      } else {
        res.status(400).json("Category not found.");
      }
    });
});

router.post("/add", function (req: Request, res: Response) {
  if (req.body.token === "1234key1234") {
    api.addCategory(req, res);
    res.status(201).json("Token accepted - product added");
  } else {
    res.status(406).json("Something went wrong. Category not created");
  }
});

export default router;
