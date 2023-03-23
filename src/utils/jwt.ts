import { Request,Response } from "express";
const jwt = require('jsonwebtoken');
const dotenv = require("dotenv")



export function generateAccessToken(user:any){
  const secret = process.env.TOKEN_SECRET
  const token = jwt.sign(user,secret,{ expiresIn:'1h'})
  return token
}





