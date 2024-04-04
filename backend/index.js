import express from "express";
const json = express.json;
import cors from "cors";
import mongoose from "mongoose";
import Watchlist from "./model.js";

const app = express();
const port = 4000;

app.use(cors());

app.use(json());

let resCon = await mongoose.connect(
  "mongodb+srv://admin:admin@cluster0.mdbanwi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// Define your routes here
app.post("/watchlist", async (req, res) => {
  let obj = new Watchlist(req.body);

  let ress = await obj.save();

  res.status(201).json({ msg: "done" });
});

app.delete("/watchlist", async (req, res) => {
  let obj = new Watchlist(req.body);
  let ress = await Watchlist.deleteOne({
    id: obj.id,
  });

  console.log(ress);
  res.status(201).json({ msg: "done" });
});

app.get("/watchlist", async (req, res) => {
  let ress = await Watchlist.find();

  res.status(201).json(ress);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
