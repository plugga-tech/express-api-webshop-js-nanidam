import type { Request, Response } from "express";
import type { IProduct, IUser } from "./models/interfaces";

export class API {
  addUser(req: Request) {
    const newUser = {
      name: req.body.name,
      password: req.body.password,
      email: req.body.email,
    };

    req.app.locals["db"].collection("users").insertOne(newUser);
  }

  //   deleteUser(req: Request) {
  //     req.app.locals["db"]
  //       .collection("users")
  //       .deleteOne({ userName: req.body.userName })
  //       .then((results: []) => {
  //         console.log(results);
  //       });
  //   }

  logInUser(req: Request, res: Response) {
    const { email, password } = req.body;
    req.app.locals["db"]
      .collection("users")
      .find()
      .toArray()
      .then((users: IUser[]) => {
        const foundUser: IUser | undefined = users.find(
          (user: IUser) => user.email === email
        );

        //when user's password matches with password in inputfield -> send back foundUser to frontend
        if (foundUser && foundUser.password === password) {
          res.status(200).json({
            _id: foundUser._id,
            name: foundUser.name,
            email: foundUser.email,
          });
        } else {
          res.status(401).json("Felaktig e-mail eller lösenord");
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

    req.app.locals["productsDB"].collection("products").insertOne(newProduct);

    //insert many
    // const newProduct: IProduct[] = req.body;
    // req.app.locals["productsDB"].collection("products").insertMany(newProduct);
  }
}
