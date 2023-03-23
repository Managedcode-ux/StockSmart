import { Request,Response,NextFunction } from "express";


export function extractUser(req:Request){

  const user = req.user;
  if(!user) throw new Error("User not found");
  return user;
}