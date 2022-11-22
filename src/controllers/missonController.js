import expres from "express";
import db from "../config/db.js";

const router = expres.Router();

export const createMissions = (req, res) => {
  const strings = req.body.map((item, index) => {
    return (
      "('" +
      item.order +
      "', " +
      item.points +
      ", " +
      item.isStackable +
      ", " +
      item.challenge_id +
      ")"
    );
  });

  const missions = strings.join();

  const createMissionsReq =
    "INSERT INTO mission(mission_order, mission_points,mission_isStackable, mission_challenge_id) VALUES" +
    missions;

  db.query(createMissionsReq, (err, result) => {
    if (err) {
      console.log("-----ERROR-----", err);
    } else {
      return res.status(200).json({
        message: "missions created",
      });
    }
  });
};

export const getMissionsChallenge = (req, res) => {
  const { challenge_id, user_id } = req.query;

  const getMissionsChallengeReq =
    "SELECT mission_id as id, mission_order as m_order, mission_points as points, mission_isStackable as isStackable, mission_challenge_id as challenge_id FROM mission WHERE mission.mission_challenge_id = " +
    challenge_id;

  db.query(getMissionsChallengeReq, (err, result) => {
    if (err) {
      console.log(err);
    }
    console.log(result);
    res.status(200).json(result);
  });
};

export const getMissionChallengerConnected = (req, res) => {
  const { challenge_id, user_id } = req.query;


  const date = new Date().toJSON().slice(0, 10)

  //check if user already participate during the day

  const hasParticipateTodayReq = `SELECT * FROM score WHERE score.score_date = '${date}' AND score.score_challenge_id = ${challenge_id} AND score.score_user_id = ${user_id}`;

  db.query(hasParticipateTodayReq, (err, hasParticipateTodayResult) => {
    if (err)
      return res.status(400).json({ message: "somthing went wrong", err });

    if (hasParticipateTodayResult.length) {
      // mean that the user already participate today
      console.log("user already participate today");
      const getMissionAlreadyParticipateReq = `SELECT m.mission_id as id, s.score_points as score, s.score_iteration as iteration, m.mission_order as m_order, m.mission_points points, m.mission_isStackable as isStackable FROM score s INNER JOIN mission m on m.mission_id = s.score_mission_id WHERE s.score_user_id = ${user_id} AND m.mission_challenge_id = ${challenge_id} AND s.score_date = '${date}'`;
      console.log(getMissionAlreadyParticipateReq)
      db.query(getMissionAlreadyParticipateReq, (err, result) => {
        if (err) {
          return res.status(400).json({ message: "somthing went wrong", err });
        }
        console.log(result)
        return res.status(200).json({ missions: result, participate: true });
      });
    } else {
      console.log("user did not participate today");
      const getmissionInforeq = `SELECT m.mission_id as id, m.mission_points as points, m.mission_isStackable as isStackable, m.mission_order as m_order   FROM mission as m WHERE m.mission_challenge_id = ${challenge_id}`;
      db.query(getmissionInforeq, (err, getmissionInfoResult) => {
        if (err)
          return res.status(400).json({ message: "somthing went wrong", err });
        const missions = getmissionInfoResult.map((item) => ({
          ...item,
          iteration: 0,
          score: 0,
        }));
        return res.status(200).json({ missions: missions, participate: false });
      });
    }
  });

  // db.query(getMissionChallengerConnectedReq, (err, result) => {
  //   if (err) {
  //     res.status(400).json({
  //       message: "Une erreur est survenue",
  //       err,
  //     });
  //   }

  //   res.status(200).json(result);
  // });
  // "SELECT m.mission_id, s.score_points, s.score_iteration, m.mission_order, m.mission_points, m.mission_isStackable FROM score s
  // INNER JOIN mission m on m.mission_id = s.score_mission_id
  // WHERE s.score_user_id = 4 AND m.mission_challenge_id = 1"
};

export default router;
