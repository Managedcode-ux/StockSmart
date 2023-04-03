import { Request,Response } from "express";
import { addStockToDb } from "../services/stock.service";
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