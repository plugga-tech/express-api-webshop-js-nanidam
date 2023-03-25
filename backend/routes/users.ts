import express, { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { API } from "../src/API.js";
import type { IUser } from "../src/models/interfaces.js";

const router = express.Router();

const api = new API();

//get users' id, name and email. NOT password
router.get("/", function (req, res) {
  req.app.locals["db"]
    .collection("users")
    .find()
    .project({ password: false })
    .toArray()
    .then((results: IUser[]) => {
      res.send(results);
    });
});

//get specific user by id
router.post("/", function (req, res) {
  req.app.locals["db"]
    .collection("users")
    .findOne({ _id: new ObjectId(req.body.id) })
    .then((result: IUser) => {
      console.log(result);

      res.json({ _id: result._id, name: result.name, email: result.email });
    });
});

// add a user
router.post("/add", function (req: Request, res: Response) {
  api.addUser(req);
  res.send(`User ${req.body.name} added!`);
});

// when existing user logs in
router.post("/login", (req: Request, res: Response) => {
  api.logInUser(req, res);
});

export default router;
