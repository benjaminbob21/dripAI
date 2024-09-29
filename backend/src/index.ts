import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
const app = express();
import path from "path";

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use(express.static(path.join(__dirname, "../../frontend/dist")));

app.get("/.api/test", async (req: Request, res: Response) => {
  res.json({ message: "hello from express endpoint!" });
});

app.listen(7000, () => {
  console.log("server running on localhost:7000");
});
