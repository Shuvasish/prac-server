const express = require("express");
require("dotenv").config();
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kni9h.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(cors());
app.use(bodyParser.json());

app.get("/check", (req, res) => {});

client.connect((err) => {
  const productsCollection = client
    .db(`${process.env.DB_NAME}`)
    .collection(`${process.env.DB_COLLECTION}`);

  const ordersCollection = client
    .db(`${process.env.DB_NAME}`)
    .collection(`${process.env.DB_COLLECTION_TWO}`);

  // insert
  app.post("/addProduct", (req, res) => {
    const products = req.body;

    productsCollection.insertOne(products).then((result) => {
      // console.log(result.insertCount);
      result.insertedCount > 0 && res.send({ ok: "pai" });
    });
    // console.log(req.body);
  });
  //read
  app.get("/products", (req, res) => {
    productsCollection.find({}).toArray((err, documents) => {
      // console.log(documents);
      res.send(documents);
    });
  });

  // read single product
  app.get("/product/:key", (req, res) => {
    productsCollection
      .find({
        key: req.params.key,
      })
      .toArray((err, documents) => {
        // console.log(documents);
        res.send(documents[0]);
      });
  });

  // read many product
  app.post("/productsByKeys", (req, res) => {
    console.log(req.body);
    productsCollection
      .find({ key: { $in: req.body } })
      .toArray((err, documents) => {
        res.send(documents);
      });
  });

  app.delete("/delete", (req, res) => {
    productsCollection.deleteMany({}).then((result) => {
      console.log(result.deletedCount);
      res.send({ kire: "khaici tore" });
    });
  });
  // perform actions on the collection object
  //   client.close();

  // insert order details
  app.post("/addOrder", (req, res) => {
    const order = req.body;

    ordersCollection.insertOne(order).then((result) => {
      // console.log(result.insertCount);
      result.insertedCount > 0 && res.send({ ok: "pai" });
    });
    // console.log(req.body);
  });

  console.log("connected to db");
});

app.listen(4000, () => {
  console.log("app is listening");
});
