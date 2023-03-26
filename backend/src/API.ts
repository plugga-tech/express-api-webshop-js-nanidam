import type { Request, Response } from "express";
import type { IOrder, IProduct, IUser } from "./models/interfaces";
import crypto from "crypto-js";

const SECRETKEY = "testFrudd";

export class API {
  addUser(req: Request, res: Response) {
    const savedPassword = crypto.AES.encrypt(
      req.body.password,
      SECRETKEY
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
            SECRETKEY
          ).toString(crypto.enc.Utf8);

          if (password === decryptedUserPassword) {
            res.status(202).json(`Welcome ${foundUser.name}`);
          } else {
            res.status(401).json("Wrong mail or password");
          }
        }
      });
  }

  addProduct(req: Request, res: Response) {
    const newProduct: IProduct = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      lager: req.body.lager,
      category: req.body.category,
      token: req.body.token,
    };

    req.app.locals["productsDB"].collection("products").insertOne(newProduct);

    if (newProduct) {
      res.status(201).json(newProduct);
    } else {
      res.status(406).json("Product not added");
    }

    //add many products
    // const newProducts: IProduct[] = req.body;
    // req.app.locals["productsDB"].collection("products").insertMany(newProducts);
    // if (newProducts) {
    //   res.status(201).json(newProducts);
    // } else {
    //   res.status(406).json("Products not added");
    // }
  }

  addOrder(req: Request, res: Response) {
    const newOrder: IOrder = req.body;
    req.app.locals["ordersDB"].collection("orders").insertOne(newOrder);

    if (newOrder) {
      res.status(201).json(newOrder);
    } else {
      res.status(406).json("Order not added");
    }
  }
}
