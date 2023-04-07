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


async function addUserWatchListToDB(userId: string, companies: string[]) {
  const searchQuery = { user_Id: userId }
  const updateQuery = { $addToSet: { company_code_list: { $each: companies } } }
  const options = { upsert: true, new: true }

  try {
    const result = await watchListModel.findOneAndUpdate(searchQuery, updateQuery, options)
    return { stat: result, error: null }
  } catch (err) {
    console.error(err)
    return { stat: null, error: err }
  }
}


async function destructureCompanyListAndCode(userId:string,codeAndNameArray:[string,string[]]){
  let finalData
  let error
  const [header,companies] = codeAndNameArray
  
  if(header === "CompanyNameList"){
    const respectiveCodes :string[] = []
    
    try {
      const res = await StockModel.find({company_name:{$in:companies}})
      for(const obj of res){
        respectiveCodes.push(obj.company_code)
      }
      const returnedData = await addUserWatchListToDB(userId,respectiveCodes)
      finalData = returnedData.stat
    } catch (err) {
      error = err
    }
    
  }
  else{
    try {
      const returnedData = await addUserWatchListToDB(userId,companies)
      finalData = returnedData.stat
    } catch (err) {
      error = err
    }
  }  
  return {data:finalData,errors:error}
}




export async function addUserWatchList(user:userI,watchList:Partial<watchListI>){

  const userId = user._id
  let finalResult:unknown
  let errors:unknown

  const promises = Object.entries(watchList).map((pair) => destructureCompanyListAndCode(userId,pair))

  try {
    const results = await Promise.all(promises)
    finalResult = results.map(result => result.data)
    errors = results.map(result => result.errors)
  } catch (err) {
    errors = err
  }

  return {data:finalResult,errors:errors}
}
