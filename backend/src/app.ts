import express, { Application } from "express";
import { MongoClient } from "mongodb";
import usersRouter from "../routes/users.js";
import productsRouter from "../routes/products.js";
import ordersRouter from "../routes/orders.js";
import categoriesRouter from "../routes/categories.js";
import cors from "cors";
import logger from "morgan";
import path from "path";
import cookieParser from "cookie-parser";

const app: Application = express();
const port = 3000;

MongoClient.connect("mongodb://127.0.0.1:27017", {}).then(
  (client: MongoClient) => {
    console.log("mongoDb is working!");

    const db = client.db("nani-dam-API");
    app.locals["db"] = db;
  }
);

// app.get("/", (_req: Request, res: Response) => {
//   res.send("Hello World!");
// });

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const publicPath = path.resolve(
  new URL(import.meta.url).pathname,
  "..",
  "public"
);

app.use(cors());
app.use(express.static(publicPath));
app.use("/api/users", usersRouter);
app.use("/api/products", productsRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/categories", categoriesRouter);

app.listen(port, () => {
  console.log(port);
});
