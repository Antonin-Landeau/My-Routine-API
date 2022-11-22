import express from "express";
import cors from "cors";
import db from "./config/db.js";
import bodyParser from 'body-parser'
import path from 'path'
import { fileURLToPath } from 'url';

import routes from "./routes/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();


db.connect((err) => {
  if (err) {
    console.log("error COnnecting:" + err.message);
    return;
  }
  console.log("Connection established");
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use("/medias", express.static(path.join(__dirname, 'medias')));

app.use("/api", routes);

app.listen(8000, () => {
  console.log("App is listening on port localhost:8000");
});
