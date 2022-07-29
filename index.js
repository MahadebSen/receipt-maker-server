const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require("mongodb");

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jztvryi.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const receiptCollection = client.db("receipt-maker").collection("receipts");

    //get all receipts
    app.get("/receipts", async (req, res) => {
      const query = {};
      const cursor = receiptCollection.find(query);
      const receipts = await cursor.toArray();
      res.send(receipts);
    });

    // insert receipt
    app.post("/addreceipt", async (req, res) => {
      const receipt = req.body;
      const addReceipt = await receiptCollection.insertOne(receipt);
      res.send(addReceipt);
    });
  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hellow from receipt-maker server");
});

app.listen(port, () => {
  console.log("Server is running...");
});
