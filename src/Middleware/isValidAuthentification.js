import express from "express";

import { validateEmail  } from "../config/utils.js";



export const isValidAuthentification = async (
  req,
  res,
  next
) => {
  const { email, password} = req.body;

  const errors = [];


  if (!email || !password ) {
    errors.push("Veuillez rentrer tout les champs")
  }

  if (!validateEmail(email)) {
    errors.push("Your email is not valid");
  }


  if (errors.length > 0) return res.status(400).json({ message: errors });

  next();
};





