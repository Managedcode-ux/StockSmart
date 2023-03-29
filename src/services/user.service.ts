import { omit } from "lodash";
import bcrypt from "bcrypt";

import UserModel,{userDocument,userInput} from "../models/user.model";

export async function createUser(input:userInput){
  try{
    const user = await UserModel.create(input)
    return omit(user.toJSON(),'password')
  }catch(e:any){
    throw new Error(e);
  }
}

export async function updateUser(updateData:Partial<userInput>,currentData:userDocument){
  const user:userDocument|null  = await UserModel.findOne({'email': currentData.email})
  if(user == null) return false
  if(currentData.email != user.email) return false;
  if("password" in updateData && updateData.password!=null){
    const workFactor:string = process.env.saltWorkFactor || '10'
    const salt = await bcrypt.genSalt(parseInt(workFactor))
    const hash:string = await bcrypt.hashSync(updateData.password,salt)
    updateData.password = hash

  }
  console.log(updateData.password)
  const status = await UserModel.updateOne({_id:user.id},updateData,{new: true}).exec()
  const newData = await UserModel.findById(user._id)
  return {updatedData:omit(newData?.toJSON(),"password"),status:status.acknowledged}
}

export async function validatePassword({email,password}:{email:string,password:string}){
  
  const user = await UserModel.findOne({email})
  
  if(!user){
    return false;
  }
  
  const isValid = await user.comparePassword(password)

  if(!isValid) return false;

  return omit(user.toJSON(), 'password')
}