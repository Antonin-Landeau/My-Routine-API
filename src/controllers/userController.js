import express, { json, query } from "express";
import db from "../config/db.js";
import bcrypt, { compare } from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

export const registerUser = async (req, res) => {
  const {
    email,
    password,
    pseudo,
    firstName,
    lastName,
    birthDate,
    color
  } = req.body;
  const avatar = req.file.filename;

  const sqlCheckEmail = "SELECT * FROM `user` WHERE user_email = '" + email + "'";

  db.query(sqlCheckEmail, async (err, result) => {
    if (result?.length > 0) {
      return res.status(400).json({ message: "user already exist" });
    }

    const sqlInsertUser =
      "INSERT INTO user (user_email, user_password, user_firstname, user_lastname, user_pseudo, user_birthDate, user_color, user_avatar) VALUES (?,?,?,?,?,?,?,?)";
    const hashPaswd = await bcrypt.hash(password, 12);

    db.query(
      sqlInsertUser,
      [email, hashPaswd, firstName, lastName, pseudo, birthDate, color, avatar],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          const id = result.insertId;

          const token = jwt.sign({ id }, "secret", {
            expiresIn: "2h",
          });

          return res.status(200).json({
            message: "REgister works",
            token,
          });
        }
      }
    );
  });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const sqlCheckEmail =
    "SELECT * FROM `user` WHERE user_email = '" + email + "'";

  db.query(sqlCheckEmail, async (err, result) => {
    if (err) {
      console.log(err);
    }
    if (result.length < 1) {
      return res.status(400).json({
        message: "User does not exist",
      });
    }
    const id = result[0]["user_id"];
    const hashPassword = result[0]["user_password"];

    const isCorrectPassword = await compare(password, hashPassword);

    if (!isCorrectPassword) {
      return res.status(400).json({
        message: "Wrong passsword",
      });
    }

    const token = jwt.sign({ id }, "secret", {
      expiresIn: "1h",
    });

    return res.status(200).json({
      message: "User Login",
      token,
    });
  });
};

export const getUserInfos = async (req, res) => {
  const { id } = req.query;

  const sqlSelectUser =
    "SELECT *  FROM user WHERE user_id ='" +
    id +
    "'";

  db.query(sqlSelectUser, (err, results) => {
    if (err) return res.status(400).json({ err: err });
    return res.status(200).json(results[0]);
  });
};

// export const getUserInfosWithParams = async (req, res) => {
//   const { id } = req.query;

//   const sqlSelectUserAndParams =
//     "SELECT u.firstname, u.lastname, u.pseudo, u., u.email , up.color, up.is_notification_activated isNotifActivated, up.avatar_file userPicture FROM user u INNER JOIN parameter up WHERE u.id = " +
//     id +
//     " AND up.user_id = " +
//     id +
//     ";";

//   db.query(sqlSelectUserAndParams, (err, results) => {
//     if (err) return res.status(400).json({ err: err });
//     return res.status(200).json({
//       data: results[0],
//     });
//   });
// };


export default router;
