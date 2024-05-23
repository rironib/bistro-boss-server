const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Bistro Boss Server is Running");
});

app.listen(port, () => {
  console.log(`Server is running on : ${port}`);
});
