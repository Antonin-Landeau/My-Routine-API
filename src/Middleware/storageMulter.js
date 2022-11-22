import express from 'express'
import path from 'path'

import multer from 'multer'

export const userStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/medias");
  },
  filename: (req, file, cb) => {
    cb(null, "user_avatar_" + req.body.pseudo + path.extname(file.originalname));
  },
})

export const challengeStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/medias");
  },
  filename: (req, file, cb) => {
    cb(null, "challenge_thumbnail" + req.body.title + path.extname(file.originalname));
  },
})

