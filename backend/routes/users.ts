import express, { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { API } from "../src/API.js";
import type { IUser } from "../src/models/interfaces.js";

const router = express.Router();
const api = new API();

//get users' id, name and email. NOT password
router.get("/", (req, res) => {
  req.app.locals["db"]
    .collection("nani-dam-users")
    .find()
    .project({ password: false })
    .toArray()
    .then((result: IUser[]) => {
      if (result) {
        res.status(200).json(result);
      } else {
        res.status(404).json("Users not found :( ");
      }
    });
});

router.post("/", (req, res) => {
  req.app.locals["db"]
    .collection("nani-dam-users")
    .findOne({ _id: new ObjectId(req.body.id) })
    .then((result: IUser) => {
      if (result) {
        res
          .status(200)
          .json({ _id: result._id, name: result.name, email: result.email });
      } else {
        res.status(404).json("User not found.");
      }
    });
});

// add a user
router.post("/add", (req, res) => {
  api.addUser(req, res);
  res.send(`User added!`);
});

// when existing user logs in
router.post("/login", (req: Request, res: Response) => {
  api.logInUser(req, res);
});

//get specific user by id
router.post("/:id", (req, res) => {
  req.app.locals["db"]
    .collection("nani-dam-users")
    .findOne({ _id: new ObjectId(req.params.id) })
    .then((result: IUser) => {
      if (result) {
        res
          .status(200)
          .json({ _id: result._id, name: result.name, email: result.email });
      } else {
        res.status(404).json("User not found.");
      }
    });
});

export default router;
