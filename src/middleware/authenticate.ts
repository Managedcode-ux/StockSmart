import { Request,Response,NextFunction } from "express";
const jwt = require('jsonwebtoken')

declare module 'express-serve-static-core' {
  export interface Request {
    user: any
  }
}

export function authenticateToken(req:Request,res:Response,next:NextFunction){
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]

  if(token == null) return res.sendStatus(401)

  jwt.verify(token,process.env.TOKEN_SECRET as string, (error:any,user:any)=> {
    if(error) return res.sendStatus(403)
    req.user = user
    next();
  })
}