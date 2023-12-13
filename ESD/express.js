const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;
const { MongoClient } = require("mongodb");

// Connection URL and database name
const url = "mongodb://localhost:27017";
const dbName = "shopdb";

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  MongoClient.connect(url, (err, client) => {
    if (err) throw err;

    const db = client.db(dbName);
    const collection = db.collection("petProfiles");

    collection.find({}).toArray((err, pets) => {
      if (err) throw err;

      // Render pets in box layout
      res.send(`
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Pet Profiles</title>
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
          <style>
            .pet-container {
              display: flex;
              flex-wrap: wrap;
              justify-content: space-around;
            }
            .pet-card {
              width: 300px;
              margin: 20px;
              padding: 20px;
              border: 1px solid #ccc;
              border-radius: 10px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Pet Profiles</h1>
            <div class="pet-container">
              ${pets.map(pet => `
                <div class="pet-card">
                  <h2>${pet.name}</h2>
                  <p>Age: ${pet.age} years</p>
                  <p>Breed: ${pet.breed}</p>
                  <p>Description: ${pet.description}</p>
                </div>
              `).join("")}
            </div>
          </div>
        </body>
        </html>
      `);

      client.close();
    });
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
