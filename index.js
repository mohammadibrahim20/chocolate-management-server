const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.tjdcdj5.mongodb.net/?retryWrites=true&w=majority`;

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

    const choclateCollections = client
      .db("chocolateDB")
      .collection("chocolates");

    app.post("/chocolates", async (req, res) => {
      const item = req.body;
      console.log(item);
      const result = await choclateCollections.insertOne(item);
      res.send(result);
    });

    app.put("/chocolates/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateItem = req.body;
      const chocolates = {
        $set: {
          name: updateItem.name,
          category: updateItem.category,
          photo: updateItem.photo,
          country: updateItem.country,
        },
      };
      const result = await choclateCollections.updateOne(
        filter,
        chocolates,
        options
      );
      res.send(result);
    });
    app.get("/chocolates", async (req, res) => {
      const cursor = choclateCollections.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/chocolates/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await choclateCollections.findOne(query);
      res.send(result);
    });
    app.delete("/chocolates/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await choclateCollections.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`Choclate server app listening on port ${port}`);
});
