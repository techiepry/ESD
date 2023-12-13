const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;
const { MongoClient } = require("mongodb");

// Connection URL and database name
const url = "mongodb://127.0.0.1:27017";
const dbName = "shopdb";

app.use(express.json());
app.use(cors()); // Enable CORS for all routes

async function addPetProfile(req, res) {
  const client = new MongoClient(url);
  try {
    await client.connect();
    console.log("Connected to the database");

    const db = client.db(dbName);
    const collection = db.collection("petprofiles");

    const { name, age, breed, personality, imageUrl } = req.body;

    // Create a new pet profile document
    const newPetProfile = {
      name: name,
      age: age,
      breed: breed,
      personality: personality,
      imageUrl: imageUrl
    };

    // Insert the document into the collection
    const result = await collection.insertOne(newPetProfile);
    console.log("Created pet profile:", result.insertedId);

    res.send(result.insertedId);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Internal Server Error");
  } finally {
    await client.close();
    console.log("Disconnected from the database");
  }
}

app.post("/addPetProfile", (req, res) => {
  addPetProfile(req, res);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
