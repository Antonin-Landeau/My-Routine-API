import express from "express";

export const isValidRegistration = async (
  req,
  res,
  next
) => {
  const { email, password, confirmPassword, pseudo, firstName, lastName, color} = req.body;
  console.log(req.body)

  const errors = [];

  if (confirmPassword !== password) {
    errors.push("Veuillez rentrer deux fois le même mdp");
  }

  if (!email || !password || !confirmPassword || !pseudo || !firstName|| !lastName || !color) {
    errors.push("Veuillez rentrer tout les champs");
  }

  // if (validateEmail(email)) {
  //   errors.push("Your email is not valid");
  // }

  if (!validatePassword(password)) {
    errors.push("passwod security");
  }

  if (errors.length > 0) return res.status(400).json({ message: errors });

  next();
};

export function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export const validatePassword = (password) => {
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[-_])\S{6,25}$/;
  return re.test(password);
};
