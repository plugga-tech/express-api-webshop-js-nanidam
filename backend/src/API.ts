import type { Request, Response } from "express";
import type { ICategory, IOrder, IProduct, IUser } from "./models/interfaces";

import crypto from "crypto-js";
import dotenv from "dotenv";
import { ObjectId } from "mongodb";

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

    req.app.locals["db"].collection("nani-dam-users").insertOne(newUser);

    if (newUser) {
      res.status(201).json({ name: newUser.name, email: newUser.email });
    } else {
      res.send(404).json("User not added.");
    }
  }

  logInUser(req: Request, res: Response) {
    const { email, password } = req.body;

    req.app.locals["db"]
      .collection("nani-dam-users")
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
    //VG: Create product
    const newProduct: IProduct = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      lager: req.body.lager,
      category: req.body.category,
      token: req.body.token,
    };

    //G: Create product
    // const newProduct: IProduct = {
    //   name: req.body.name,
    //   description: req.body.description,
    //   price: req.body.price,
    //   lager: req.body.lager,
    // };

    req.app.locals["db"].collection("nani-dam-products").insertOne(newProduct);

    //add many products
    // const newProducts: IProduct[] = req.body;
    // req.app.locals["productsDB"].collection("nani-dam-products").insertMany(newProducts);
  }

  addOrder(req: Request, res: Response) {
    const newOrder: IOrder = req.body;

    newOrder.products.forEach((product) => {
      const id = product?.productId;
      const quantity = product?.quantity as number;

      // Decrease in quantity in "lager"
      req.app.locals["db"]
        .collection("nani-dam-products")
        .findOneAndUpdate(
          { _id: new ObjectId(id) },
          { $inc: { lager: -quantity } },
          { returnOriginal: false }
        )
        .then((result: any) => {
          console.log(result);
        });
    });

    req.app.locals["db"].collection("nani-dam-orders").insertOne(newOrder);

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
      req.app.locals["db"]
        .collection("nani-dam-categories")
        .insertOne(newCategory);
      res.status(201).json(newCategory);
    } else {
      res.status(406).json("Category not added");
    }
  }
}
