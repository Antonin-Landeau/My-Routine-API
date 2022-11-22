import express from "express";
import db from "./../config/db.js";

export const createOrUpdateScore = (req, res) => {
  const { missions, user_id } = req.body;



  const date = new Date().toJSON().slice(0, 10)


  const isExistingMisisionForTheDayReq = `SELECT * FROM score WHERE score.score_date = ${date} AND score.score_user_id = ${user_id}`;

  db.query(isExistingMisisionForTheDayReq, (err, result) => {
    if (err)
      return res.status(400).json({ message: "somthing went grong", err });
    if (result.length) {
      console.log("il y as des res ducoup il faut update");
    } else {
      console.log("il y as pas de resultat ducoup il faut insert into");
      console.log(missions);
      const insertMissionReq = `INSERT INTO score ()`;
    }
  });
};

export const createScore = (req, res) => {


  const date = new Date().toJSON().slice(0, 10)


  const values = req.body.map((item) => {
    return (
      "(" +
      item.points +
      ", '" +
      date +
      "', " +
      item.user_id +
      ", " +
      item.mission_id +
      ", " +
      item.challenge_id +
      ", " +
      item.iteration +
      ")"
    );
  });

  const createScoreReq = `INSERT INTO score (score_points, score_date, score_user_id, score_mission_id, score_challenge_id, score_iteration) VALUES ${values}`;


  db.query(createScoreReq, (err, result) => {
    if (err) {
      console.log(err);
    }
    return res.status(200).json({
      message: "Save points",
    });
  });
};

export const updateScore = (req, res) => {


  const date = new Date().toJSON().slice(0, 10)

  const allReq = req.body.map((item) => {
    return (
      "UPDATE score SET score_points = " +
      item.score_points +
      ", score_iteration = " +
      item.score_iteration +
      " WHERE score_user_id = " +
      item.user_id +
      " AND score_date = '" +
      date +
      "' AND score_mission_id = " +
      item.mission_id +
      ";"
    );
  });

  const foramtedReq = allReq.join('');

  db.query(foramtedReq, (err, result) => {
    if (err) {
      console.log(err);
    }
    return res.status(200).json({
      message: "Update points",
    });
  })

};
