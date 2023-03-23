import express from 'express'
import connect from './utils/connect'
import logger from './utils/logger'
import routes from './routes'
import dotenv from "dotenv"

dotenv.config()


const port = process.env.PORT 
var morgan = require('morgan')

const app = express();

app.use(morgan('combined'))
app.use(express.json())
app.use(express.urlencoded())



app.listen(port,async()=> {
  logger.info(`App running on ${port} port`);

  await connect();
  routes(app)
})