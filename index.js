const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = process.env.DB_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const menuCollection = client.db("BistroDB").collection("menu");
    const cartCollection = client.db("BistroDB").collection("carts");
    const reviewCollection = client.db("BistroDB").collection("reviews");

    // Menu Collection
    app.get("/menu", async (req, res) => {
      const result = await menuCollection.find().toArray();
      res.send(result);
    });

    // Cart Collection
    //// GET: Get cart data
    app.get("/carts", async (req, res) => {
      const email = req.query.email.toLowerCase();
      const query = { email: email };
      const result = await cartCollection.find(query).toArray();
      res.send(result);
    });

    //// POST: Add data to cart
    app.post("/carts", async (req, res) => {
      const cartItem = req.body;
      const result = await cartCollection.insertOne(cartItem);
      res.send(result);
    });

    //// DELETE: Remove data from cart
    app.delete("/carts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await cartCollection.deleteOne(query);
      res.send(result);
    });

    // Review Collection
    app.get("/reviews", async (req, res) => {
      const result = await reviewCollection.find().toArray();
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Bistro Boss Server is Running");
});

app.listen(port, () => {
  console.log(`Server is running on : ${port}`);
});
