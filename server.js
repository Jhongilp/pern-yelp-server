require("dotenv").config();
// const morgan = require("morgan");
const express = require("express");
const cors = require("cors")
const db = require("./db");

const app = express();

// app.use((req, res, next) => {
//     console.log("this is a middleware");
//     next();
// });
// app.use(morgan("dev")); // third party middleware

app.use(cors());
app.use(express.json()); // middleware that append a body property in the request

app.get("/api/v1/restaurants", async (req, res) => {
  try {
    const results = await db.query("SELECT * FROM restaurants");
    // console.log("results: ", results);
    res.json({
      status: "success",
      results: results.rows.length,
      data: {
        restaurant: results.rows,
      },
    });
  } catch (error) {
    console.log("Error fetching all restaurants");
    res.status(500).json({
      status: "failure",
      results: 0,
    });
  }
});

app.get("/api/v1/restaurants/:id", async (req, res) => {
  try {
    const results = await db.query("SELECT * FROM restaurants WHERE id = $1", [
      req.params.id,
    ]);
    // console.log(results.rows);
    res.status(200).json({
      status: "success",
      data: {
        restaurant: results.rows[0],
      },
    });
  } catch (error) {}
});

// CREATE
app.post("/api/v1/restaurants", async (req, res) => {
  // console.log("req: ", req.body);

  try {
    const { name, location, price_range } = req.body;
    const results = await db.query(
      "INSERT INTO restaurants (name, location, price_range) values ($1, $2, $3) returning *",
      [name, location, price_range]
    );
    // console.log("create results: ", results);
    res.status(201).json({
      status: "success",
      data: {
        restaurant: results.rows[0],
      },
    });
  } catch (error) {}
});

// UPDATE
app.put("/api/v1/restaurants/:id", async (req, res) => {
  try {
    const { name, location, price_range } = req.body;
    const { id } = req.params;
    const results = await db.query(
      "UPDATE restaurants SET name = $1, location = $2, price_range = $3 WHERE id = $4 returning *",
      [name, location, price_range, id]
    );

    res.status(200).json({
      status: "success",
      data: {
        restaurant: results.rows[0],
      },
    });
  } catch (error) {
    console.log("Error trying to update item: ", error);
  }
});

app.delete("/api/v1/restaurants/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM restaurants WHERE id = $1", [req.params.id]);
    res.status(204).json({
      status: "success",
    });
  } catch (error) {
    console.log("Error trying to delete item: ", error);
  }
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Express server listening at port ${PORT}`);
});
