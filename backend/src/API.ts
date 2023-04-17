import type { Request, Response } from "express";
import type { ICategory, IOrder, IProduct, IUser } from "./models/interfaces";

import crypto from "crypto-js";
import dotenv from "dotenv";

dotenv.config();

export class API {
  addUser(req: Request, res: Response) {
    const savedPassword = crypto.AES.encrypt(
      req.body.password,
      process.env["SECRETKEY"]!
    ).toString();

    const newUser = {
      name: req.body.name,
      password: savedPassword,
      email: req.body.email,
    };

    req.app.locals["usersDB"].collection("users").insertOne(newUser);

    if (newUser) {
      res.status(201).json({ name: newUser.name, email: newUser.email });
    } else {
      res.send(404).json("User not added.");
    }
  }

  logInUser(req: Request, res: Response) {
    const { email, password } = req.body;

    req.app.locals["usersDB"]
      .collection("users")
      .find()
      .toArray()
      .then((users: any) => {
        const foundUser: IUser | undefined = users.find(
          (user: IUser) => user.email === email
        );

        if (foundUser) {
          const decryptedUserPassword = crypto.AES.decrypt(
            foundUser.password,
            process.env["SECRETKEY"]!
          ).toString(crypto.enc.Utf8);

          if (password === decryptedUserPassword) {
            res.status(202).json({ name: foundUser.name, id: foundUser._id });
          } else {
            res.status(401).json("Wrong mail or password");
          }
        }
      });
  }

  addProduct(req: Request) {
    const newProduct: IProduct = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      lager: req.body.lager,
      category: req.body.category,
      token: req.body.token,
    };

    req.app.locals["db"].collection("products").insertOne(newProduct);

    //add many products
    // const newProducts: IProduct[] = req.body;
    // req.app.locals["productsDB"].collection("products").insertMany(newProducts);
  }

  addOrder(req: Request, res: Response) {
    const newOrder: IOrder = req.body;

    req.app.locals["db"].collection("orders").insertOne(newOrder);

    if (newOrder) {
      res.status(201).json(newOrder);
    } else {
      res.status(406).json("Order not added.");
    }
  }

  addCategory(req: Request, res: Response) {
    const newCategory: ICategory = {
      name: req.body.name,
      token: req.body.token,
    };

    //check token
    if (newCategory.token) {
      req.app.locals["db"].collection("categories").insertOne(newCategory);
      res.status(201).json(newCategory);
    } else {
      res.status(406).json("Category not added");
    }
  }
}
