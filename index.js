import express from "express";
import dotenv from "dotenv";
import router from "./routes/index.js";

dotenv.config();

const app = express();

app.use(express.json());

app.use("/", router);

const PORT = process.env.SERVER_PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
