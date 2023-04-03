import {StockModel, stockAddition } from "../models/stock.model";


export async function addStockToDb(data:object){
  // console.log(data)
  let copydata:any = []
  let success:any = [];
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