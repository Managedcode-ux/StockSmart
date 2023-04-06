import internal from "stream";
import {StockModel, stockAddition,watchListModel } from "../models/stock.model";

interface userI{
  _id:string;
  email:string;
  username:string;
  created_at:string;
  updated_at:string;
  __v:number;
  iat:number;
  exp:number;
}

interface watchListI{
  CompanyNameList :string[];
  CompanyCode:string[];
}




export async function addStockToDb(data:object){
  let copydata:string[] = []
  let success:string[] = [];
  for(let[key,value] of Object.entries(data)){
    
    await StockModel.create({company_name:key, company_code:value})
    .then(result => {
      success.push(key)
    })
    .catch(error => {
      copydata.push(key)
    })    
  }
  return {success,copydata}
}


async function addUserWatchListToDB(userId:string,companies:string[]){
  const searchQuery = {user_Id:userId}
  const updateQuery = {$addToSet:{company_code_list:{$each:companies}}}
  const options = {upsert:true,new:true}
  watchListModel.findOneAndUpdate(searchQuery,updateQuery,options)
  .then(res=>console.log(res))
  .catch(err=>console.log(err))
}



export async function addUserWatchList(user:userI,watchList:Partial<watchListI>){
  const userId = user._id
  
  Object.entries(watchList).forEach(([header,companies]) => {
    
    if(header === "CompanyNameList"){
      const respectiveCodes :string[] = []
      
      StockModel.find({company_name:{$in:companies}})
      .then((res)=>{
        for(const obj of res){
          respectiveCodes.push(obj.company_code)
        }
        
        addUserWatchListToDB(userId,respectiveCodes)

      })
      .catch(err=>console.log(err))
      
    }
    else{
      addUserWatchListToDB(userId,companies)
    }  
  })
}