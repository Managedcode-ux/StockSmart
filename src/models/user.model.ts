import mongoose from "mongoose";
import bcrypt from "bcrypt";

export interface userInput
{
  email: string,
  name:string,
  password:string,
}

export interface userDocument extends userInput,mongoose.Document{
  createdAt:Date,
  updatedAt:Date
  comparePassword(candidatePassword:string):Promise<boolean>
}


const userSchema = new mongoose.Schema({
  email:{type:String,required:true,unique:true},
  name:{type:String,required:true},
  password:{type:String,required:true}
},{timestamps: true})

userSchema.pre("save",async function(next){
  const user = this as userDocument

  if (!user.isModified("password")){
    return next();
  }
  
  const workFactor:string = process.env.saltWorkFactor  || '10'

  const salt = await bcrypt.genSalt(parseInt(workFactor))

  const hash = await bcrypt.hashSync(user.password,salt)

  user.password = hash

  return next();
})

userSchema.methods.comparePassword = async function (candidatePassword:string):Promise<boolean>{
  const user = this as userDocument
  return bcrypt.compare(candidatePassword,user.password).catch((e)=>false);
}

const UserModel= mongoose.model<userDocument>('User',userSchema)

export default UserModel