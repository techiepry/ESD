const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;
const { MongoClient } = require("mongodb");

// Connection URL and database name
const url = "mongodb://127.0.0.1:27017";
const dbName = "shopdb";

app.use(express.json());
app.use(cors());

async function createCustomer(req, res) {
  const client = new MongoClient(url);
  try {
    await client.connect();
    console.log("Connected to the database");

    const db = client.db(dbName);
    const collection = db.collection("newusers");

    const { fullName, email, phone, address, password } = req.body;

    // Create a new customer document
    const newCustomer = {
      fullName: fullName,
      email: email,
      phone: phone,
      address: address,
      password: password
    };

    // Insert the document into the collection
    const result = await collection.insertOne(newCustomer);
    console.log("Created customer:", result.insertedId);

    res.send(result.insertedId);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Internal Server Error");
  } finally {
    await client.close();
    console.log("Disconnected from the database");
  }
}

async function readCustomers(req, res) {
  const client = new MongoClient(url);
  try {
    await client.connect();
    console.log("Connected to the database");

    const db = client.db(dbName);
    const collection = db.collection("customers");

    // Find all customer documents in the collection
    const result = await collection.find().toArray();

    res.json(result);
    console.log("Fetched customers:", result.length);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Internal Server Error");
  } finally {
    await client.close();
    console.log("Disconnected from the database");
  }
}

app.get("/", (req, res) => {
  res.send("Hello");
});

app.post("/create", (req, res) => {
  createCustomer(req, res);
});

app.get("/read", (req, res) => {
  readCustomers(req, res);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});