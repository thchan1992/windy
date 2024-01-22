import express from "express";
import connectDB from "./config/db";
import "dotenv/config";
import UserRouter from "./routes/UserRouter";
import RecipeRouter from "./routes/RecipeRouter";

const app = express();
app.use(express.json());
const port = process.env.PORT;

connectDB();

app.use("/users", UserRouter);
app.use("/recipes", RecipeRouter);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});
