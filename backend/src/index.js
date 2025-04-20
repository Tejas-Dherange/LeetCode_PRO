import express from "express";
import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT || 4000;

const app = express();

app.get("/", (req, res) => {
  res.json({
    " message": "request successful",
  });
});

app.listen(port, () => {
  console.log(`app is running on port ${port}`);
});
