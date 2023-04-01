import mongoose from "mongoose";

export interface stockAddition{
  company_name:string,
  company_code:string
}

export interface stockDocument extends stockAddition,mongoose.Document{
  createdAt:Date,
  updatedAt:Date,
}

const stockSchema = new mongoose.Schema({
  company_name:{type:String,required:true,},
  company_code:{type:String,required:true,unique:true}
},{timestamps:true})

stockSchema.pre("save",async function (next){
  const stockDetails = this as stockAddition
  stockDetails.company_name = stockDetails.company_name.toLowerCase() 
  return next();
})

export const StockModel = mongoose.model<stockDocument>('StocksInfo',stockSchema)