import express from "express";
import db from "../config/db.js";

const router = express.Router();

export const getUserParameters = async (req, res) => {
  const { id } = req.query;
  console.log(id)

  const sqlSelectParams =
    "SELECT * FROM parameter WHERE user_id = " + id + "";

  db.query(sqlSelectParams, (err, results) => {
    if (err) return res.status(400).json({err: err})
    return res.status(200).json({
      data: results[0]
    })
  })

};

export default router;
