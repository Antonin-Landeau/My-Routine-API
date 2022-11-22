import express from "express";
import db from "../config/db.js";

const router = express.Router();

export const getAllRules = async (req, res) => {
  //Query Params
  const { language } = req.query;
  console.log('Language', language);
  const sqlSelectAllRules =
    "SELECT r.id, r.coefficient, r.credit, rc.color, rct.name AS cat, rt.name AS ruleName, rt.description as ruleDescription FROM rule r JOIN rule_category rc ON r.rule_category_id = rc.id JOIN rule_category_translation rct ON rc.id = rct.rule_category_id JOIN rule_transaltion rt ON r.id = rt.rule_id WHERE rct.language_id = "+ language +" AND rt.language_id = "+ language +";";

  db.query(sqlSelectAllRules, (err, results) => {
    if (err)
      return res.status(400).json({
        message: err,
      });

    if (results.length < 1) {
      return res.status(400).json({
        message: "no rules",
      });
    }

    return res.status(200).json({
      data: results,
    });
  });
};

export const createGeneralRules = async (req, res) => {
  const {coefficient, credit, rule_category_id, language_id, name, description} = req.body;

  const sqlReqRuleFields = "INSERT INTO rule(coefficient, credit, rule_category_id) VALUES (?,?,?)"

  db.query(
    sqlReqRuleFields,
    [coefficient, credit, rule_category_id],
    (err, results) => {
      if (err) {
        console.log(err)
      }
      //Récupérer id de la tabl rule
      const rule_id = results.insertId;
      console.log(rule_id)

      const sqlReqRuleTranslationFields = "INSERT INTO rule_translation(rule_id, language_id, name, description) VALUES (?,?,?,?)"

      db.query(
        sqlReqRuleTranslationFields,
        [rule_id, language_id, name, description],
        (err, results) => {
          if (err) {
            console.log(err)
          }
        }
      )
      
    }
  )
}

export default router;
