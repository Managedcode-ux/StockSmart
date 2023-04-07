import { Request,Response } from "express";
import { addStockToDb,addUserWatchList } from "../services/stock.service";
import logger from "../utils/logger";

export async function addStockToDbHandler(req:Request,res:Response){
  try{
    const insertionData:any = await addStockToDb(req.body)
    const {success,copydata} = insertionData
    res.status(200).send({AddedData:success,DuplicateData:copydata})
  }catch(err:any){
    logger.error(err);
    return res.status(400).send(err.message)
  }
}


export async function addWatchListStocksHandler(req:Request,res:Response){
  try{
    const result:any = await addUserWatchList(req.user,req.body)
    if(result != null || result!=undefined){
    return res.status(200).send("Stocks Added To Watch List")
  }
  else{
    return res.status(400).send("Something went wrong")
  }
  }catch(err:any){
    logger.error(err);
    return res.status(400).send(err.message)
  }
}