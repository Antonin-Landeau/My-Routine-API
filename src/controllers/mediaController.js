import express from 'express'

const router = express.Router();

export const uploadAvatar = (req, res) => {
  console.log(req.body)
  console.log(image)
  return res.status(200).json({message: 'Media uploaded'})
}

export const getAvatar = (req, res) => {

}


export default router;