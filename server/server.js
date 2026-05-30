import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./src/config/db.js";
import authRouter from "./src/routes/authRoute.js";


connectDB();

const app = express();

const PORT = process.env.PORT || 4000;


app.use(cors());
app.use(express.json());


// API endpoints
app.use("/api/auth", authRouter);


app.get("/", (req, res) => {
  res.send("Server is running");
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});