import mongoose from "mongoose";
import { Schema,model } from "mongoose";

export interface stockAddition{
  company_name:string,
  company_code:string
}

export interface WatchList extends mongoose.Document{
  userId:Schema.Types.ObjectId,
  company_code_list:string[]
}

export interface stockDocument extends stockAddition,mongoose.Document{
  createdAt:Date,
  updatedAt:Date,
}


const stockSchema = new mongoose.Schema({
  company_name:{type:String,required:true,},
  company_code:{type:String,required:true,unique:true}
},{timestamps:true})

stockSchema.index({company_name:1})

stockSchema.pre("save",async function (next){
  const stockDetails = this as stockAddition
  stockDetails.company_name = stockDetails.company_name.toLowerCase() 
  return next();
})

export const StockModel = mongoose.model<stockDocument>('StocksInfo',stockSchema)


const WatchListStocksSchema = new mongoose.Schema({
  user_Id:{required:true,type:mongoose.Schema.Types.ObjectId},
  company_code_list:{required:true, type:Array, default:[]}
},{timestamps:true})

export const watchListModel = mongoose.model<WatchList>("UserWatchList",WatchListStocksSchema)
