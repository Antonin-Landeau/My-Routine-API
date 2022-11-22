import expres, { json } from "express";
import db from "../config/db.js";

const router = expres.Router();

export const createChallenge = (req, res) => {
  const { title, description } = req.body;
  const thumbnail = req.file.filename;

  const insertChallenge =
    "INSERT INTO challenge (challenge_title, challenge_description, challenge_thumbnail)VALUES (?,?,?)";
  db.query(insertChallenge, [title, description, thumbnail], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      return res.status(200).json({
        message: "Challenge created",
      });
    }
  });
};

export const getAllChallenges = (req, res) => {
  const selectAllChallengesReq =
    "SELECT challenge_id as id ,challenge_title as title , challenge_description as description, challenge_thumbnail as thumbnail  FROM challenge";

  db.query(selectAllChallengesReq, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
      return res.status(200).json(result);
    }
  });
};

export const getChallenge = (req, res) => {
  const { id } = req.query;

  const getChallengeReq = "SELECT * FROM challenge WHERE challenge_id =" + id;

  db.query(getChallengeReq, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      const selectChallengeMissionReq =
        "SELECT mission_order, mission_points, mission_isStackable, mission_challenge_id FROM mission WHERE mission_challenge_id =" +
        id;
      db.query(selectChallengeMissionReq, (err2, result2) => {
        if (err2) {
          console.log(err2);
        } else {
          console.log(result[0]);

          return res.status(200).json({
            id: result[0].challenge_id,
            title: result[0].challenge_title,
            description: result[0].challenge_description,
            thumbnail: result[0].challenge_thumbnail,
            missions: result2,
          });
        }
      });
    }
  });
};

const getChallengesInfo = (req, res) => {};

export const createChallengeParticipant = (req, res) => {
  const { user_id, challenge_id } = req.body;
  console.log(user_id, challenge_id);

  const insertChallengerParticipanReq =
    " INSERT INTO challenge_user VALUES (?, ?);";

  db.query(
    insertChallengerParticipanReq,
    [user_id, challenge_id],
    (err, result) => {
      if (err) {
        console.log(err);
      }
      console.log(result);
      return res.status(200).json("newChallenger in challenge" + challenge_id);
    }
  );
};

export const getUserChallenges = (req, res) => {
  const { user_id } = req.query;

  const getUserChallengesReq =
    "SELECT c.challenge_id id, challenge_title title, challenge_description description,challenge_thumbnail thumbnail FROM challenge_user cu INNER JOIN challenge c ON c.challenge_id = cu.challenge_id WHERE cu.user_id =" +
    user_id;
  db.query(getUserChallengesReq, (err, result) => {
    if (err) {
      console.log(err);
    }
    return res.status(200).json(result);
  });
};

export const isParticipant = (req, res) => {
  const { user_id, challenge_id } = req.query;

  const isParticipantReq = `SELECT * FROM challenge_user WHERE user_id = ${user_id} AND challenge_id = ${challenge_id}`;
  db.query(isParticipantReq, (err, result) => {
    if (err) {
      return res.status(400).json({
        message: "somthing went wrong",
        err,
      });
    }
    if (!result.length) {
      return res.status(200).json({
        isParticipant: false,
      });
    }
    if (result.length) {
      return res.status(200).json({
        isParticipant: true,
      });
    }
  });
};

export const getChallengeStateOfUser = (req, res) => {
  const { user_id, challenge_id } = req.query;
  const totalScoreReq = `SELECT SUM(score_points) as totalScore FROM score WHERE score_user_id = ${user_id} AND score_challenge_id = ${challenge_id};`;
  console.log(totalScoreReq);
  const finalRes = {};
  db.query(totalScoreReq, (err, totalScoreRes) => {
    if (err) {
      return res.status(400).json({
        message: "somthing went wrong",
        err,
      });
    }
    finalRes.totalScore = parseInt(totalScoreRes[0].totalScore);

    const date = new Date().toJSON().slice(0, 10)
    
    const daylyScoreReq = `SELECT SUM(score_points) as daylyTotalScore FROM score WHERE score_user_id = ${user_id} AND score_challenge_id = ${challenge_id} AND score_date = '${date};'`;
    console.log(daylyScoreReq)
    db.query(daylyScoreReq, (err, totalScoreRes) => {
      if (err) {
        
        return res.status(400).json({
          message: "somthing went wrong",
          err,
        });
      }
      finalRes.daylyScore = parseInt(totalScoreRes[0].daylyTotalScore);
      return res.status(200).json(finalRes);
    });
  });
};

const createDayScore = (req, res) => {
  //  INSERT INTO score(s_score, s_date,s_userId, s_challengeId, s_missionId)
  //  VALUES
  // 	(30, '2022-11-04', 2, 1, 1),
  // 	(20, '2022-11-04', 2, 1, 2),
  // 	(40, '2022-11-04', 2, 1, 3),
  // 	(10, '2022-11-04', 2, 1, 4),
  //  (30, '2022-11-05', 2, 1, 1),
  // 	(20, '2022-11-05', 2, 1, 2),
  // 	(40, '2022-11-05', 2, 1, 3),
  // 	(10, '2022-11-05', 2, 1, 4),
  //  (30, '2022-11-03', 2, 1, 1),
  // 	(0, '2022-11-03', 2, 1, 2),
  // 	(0, '2022-11-03', 2, 1, 3),
  // 	(10, '2022-11-03', 2, 1, 4);
};

const getScoreOfDay = (req, res) => {
  // SELECT s.s_score, m.rule FROM score as s
  // INNER JOIN missions as m ON m.id = s.s_missionId
  // WHERE s.s_date = '2022-11-04';
};

const getChallengePArticipant = (req, res) => {
  // SELECT u.firstname, u.lastname, u.pseudo FROM challenge_user AS cu
  // INNER JOIN users as u ON cu.users_id= u.id
  // WHERE challenges_id = 1;
};

export default router;
