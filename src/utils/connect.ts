import mongoose from 'mongoose'
import logger from "./logger"

async function connect(){
  const dbUri:any = process.env.dbUri 
  try{
    await mongoose.connect(dbUri)
    logger.info("DB connection established")
  }catch(error){
    logger.error("Could not connect to DB")
    process.exit(0)
  }
}

export default connect