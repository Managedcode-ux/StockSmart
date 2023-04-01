import {StockModel, stockAddition } from "../models/stock.model";


export async function addStockToDb(data:object){
  // console.log(data)
  const copydata:string[] = []
  for(let[key,value] of Object.entries(data)){
    const copyFound = await StockModel.find({value})
    if (copyFound != null){
      copydata.append()
    }

    const res = await StockModel.create({company_name:key, company_code:value})
    
  }
}