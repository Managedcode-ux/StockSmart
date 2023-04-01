import { Request,Response } from "express";
import { addStockToDb } from "../services/stock.service";
import logger from "../utils/logger";

export async function addStockToDbHandler(req:Request,res:Response){
  try{
    const insertionStatus = await addStockToDb(req.body)
    return res.status(200)
  }catch(err:any){
    logger.error(err);
    return res.status(400).send(err.message)
  }
}