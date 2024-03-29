import express from "express";
import connectDB from "./config/db";
import "dotenv/config";
import UserRouter from "./routes/UserRouter";
import RecipeRouter from "./routes/RecipeRouter";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cookieParser());
const allowedOrigins = [
  "http://localhost:3000",
  "https://wind-kmzf.vercel.app",
];

app.use(
  cors({
    origin: function (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void
    ) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS policy violation"));
      }
    },
    credentials: true,
  })
);

const port = process.env.PORT || 3001;

connectDB();

app.use("/users", UserRouter);
app.use("/recipes", RecipeRouter);

app.get("/", (req, res) => {
  res.send("This is the backend server for Good-Bye Stale");
});

app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});
