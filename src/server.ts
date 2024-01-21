import express from "express";
import connectDB from "./config/db";
import "dotenv/config";
import UserRouter from "./routes/UserRouter";
const app = express();
app.use(express.json());
const port = process.env.PORT;

connectDB();

app.use("/users", UserRouter);
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});
