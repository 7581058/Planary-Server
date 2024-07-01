import express from "express";
import dotenv from "dotenv";
import router from "./routes/index.js";
import cors from "cors";
import corsOptions from "./config/cors.js";

dotenv.config();

const app = express();

app.use(cors(corsOptions));
app.use(express.json());

app.use("/", router);

const PORT = process.env.SERVER_PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
