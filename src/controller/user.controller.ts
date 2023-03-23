import { Request,Response } from "express";
import { createUser } from "../service/user.service";
import { CreateUserInput } from "../schema/user.schema";
import { generateAccessToken } from "../utils/jwt"
import { validatePassword } from "../service/user.service";
import { omit } from "lodash";
import logger from "../utils/logger"

export async function createUserHandler(req:Request<{},{},CreateUserInput["body"]>,res:Response){
  try{
    const user = await createUser(req.body)
    return res.send(user)
  }catch(e:any){
    logger.error(e);
    return res.status(400).send(e.message)
  }
}

export async  function loginUserHandler(req:Request,res:Response){

  try{
    let user = await validatePassword(req.body);
    if(user){
    // GENERATE JWT
    const accessToken = await generateAccessToken(user)
    return res.status(200).send(accessToken);
  }
  else{
    return res.status(403).send("Invalid Email or Password");
  }
  }catch(e:any){
    console.log("Invalid")
    return res.status(403).send(e.message)
  }
  
}