import { Request,Response } from "express";
import { createUser, updateUser, deleteUser } from "../services/user.service";
import { CreateUserInput } from "../schema/user.schema";
import { generateAccessToken } from "../utils/jwt"
import { validatePassword } from "../services/user.service";
import { omit } from "lodash";
import logger from "../utils/logger"
import { extractUser } from "../utils/getUserdetails";

export async function createUserHandler(req:Request<{},{},CreateUserInput["body"]>,res:Response){
  try{
    const user = await createUser(req.body)
    return res.send(user)
  }catch(e:any){
    logger.error(e);
    return res.status(400).send(e.message)
  }
}

export async function getCurrentUserHandler(req:Request,res:Response){
  const user = extractUser(req)
  return res.status(200).send(user)  
}

export async function updateCurrentUserHandler(req:Request,res:Response){

  const updateData = req.body
  const user = extractUser(req)

  const data:any  = await updateUser(updateData,user)
  
  if(data.status== true){
    const newAccessToken = await generateAccessToken(data.updatedData)
    return res.send({Token:newAccessToken,Updated_data:data.updatedData}).status(200)
  }
  else{
    return res.send("Something went wrong").status(500)
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
    logger.error(e)
    return res.status(403).send(e.message)
  }
  
}

export async function deleteCurrentUserHandler(req:Request, res:Response){
  try{
    const data = req.body;
    const status = await deleteUser(data)
    if(status.status === true){
      return res.status(200).send(status.message)
    }
    return res.status(400).send(status.message)
  }catch(err:any){
    logger.error(err)
    return res.status(400).send(err.message)
  }
}