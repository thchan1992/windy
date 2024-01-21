import express from "express";
import connectDB from "./config/db";
import "dotenv/config";

const app = express();
app.use(express.json());
const port = process.env.PORT;
connectDB();
app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});
