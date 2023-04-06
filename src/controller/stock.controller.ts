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


export async function getWatchListStocksHandler(req:Request,res:Response){
  try{
    const res:any = await addUserWatchList(req.user,req.body)
    // return res.sendStatus(200)
  }catch(err:any){
    logger.error(err);
    res.send(400).status(err.message)
  }
}