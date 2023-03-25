import { omit } from "lodash";
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
  console.log("updateData ==>",updateData)
  console.log("currentData ==>",currentData)
  
  const user:userDocument|null  = await UserModel.findOne({'email': currentData.email})
  
  console.log("FOUND USER ==>",user)
  
  if(user == null) return false

  if(currentData.email != user.email) return false;

  await UserModel.updateOne({_id:user.id},updateData,{new: true}).exec()
  .then((response) => {
         console.log('document after updating =>', response);
         return response.acknowledged
  });

  
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