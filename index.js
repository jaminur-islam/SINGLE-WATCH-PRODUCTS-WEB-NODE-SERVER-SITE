const express = require("express");
const Object = require("mongodb").ObjectId;
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
// middleware
app.use(cors());
app.use(express.json());

// server connect mongodb
const { MongoClient } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2uuip.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const run = async () => {
  try {
    await client.connect();
    const database = client.db("watch-web");
    const productCollection = database.collection("products");
    const userCollection = database.collection("users");
    const orderCollection = database.collection("orders");
    const reviewCollection = database.collection('review');

    // Get all products api
    app.get("/products", async (req, res) => {
      const products = await productCollection.find({}).toArray();
      res.send(products);
    });

    // GET one product api
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: Object(id) };
      const result = await productCollection.findOne(query);

      res.send(result);
    });

    // POST user api
    app.post("/user", async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    // PUT user api
    app.put("/user", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: user.name,
          email: user.email,
        },
      };
      const result = await userCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    });

    // POST order api
    app.post("/order", async (req, res) => {
      const order = req.body;
      const result = await orderCollection.insertOne(order);
      res.send(result);
    });

    // Get Order api
    app.get("/order", async (req, res) => {
      const email = req.query.email;
      const filter = { userEamil: email };
      const result = await orderCollection.find(filter).toArray();

      res.send(result);
    });

    // DELETE api
    app.delete("/order/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: Object(id) };
      const result = await orderCollection.deleteOne(filter);
      res.send(result);
    });


    // POST review api
    app.post('/review' , async(req, res)=>{
      const review = req.body 
      const result = await reviewCollection.insertOne(review);
      res.send(result)
    })


    //  GET review api
    app.get('/review' , async(req , res)=>{
      const result = await reviewCollection.find({}).toArray()
      res.send(result);
    })











  } finally {
    // await client.close();
  }
};
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("server running");
});

app.listen(port, () => {
  console.log(port);
});
