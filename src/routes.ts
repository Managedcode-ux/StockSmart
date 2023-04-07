import {Express,Request,Response} from "express";

// USER PATH IMPORTS
import { createUserHandler,loginUserHandler,getCurrentUserHandler,updateCurrentUserHandler,deleteCurrentUserHandler} from "./controller/user.controller";

//STOCKS PATH IMPORTS

import { addStockToDbHandler,addWatchListStocksHandler } from "./controller/stock.controller"

//MIDDLEWARE IMPORTS
import { authenticateToken } from "./middleware/authenticate";
import validateResource from "./middleware/validateResource";

//SCHEMA IMPORTS
import { createUserSchema } from "./schema/user.schema";
import { createSessionSchema } from "./schema/login.user.schema";



function routes(app:Express){
  app.get('/healthcheck', (req, res) => res.sendStatus(200));

  //ADMIN API's
  app.post('/api/stocks/addStockToDb',addStockToDbHandler) //API TO ADD STOCKS TO DATABASE

  //USERS
  app.post('/api/user/createUsers',validateResource(createUserSchema),createUserHandler)
  app.post('/api/user/loginUser',validateResource(createSessionSchema),loginUserHandler)
  app.get('/api/user/getCurrentUser',[authenticateToken],getCurrentUserHandler)
  app.patch('/api/user/updateUser',[authenticateToken],updateCurrentUserHandler)
  app.delete('/api/user/deleteUser',[authenticateToken],deleteCurrentUserHandler)

  //STOCKS

  // "API TO GET FAV/WATCHLIST STOCKS"
  app.post('/api/stocks/addWatchListStocks',[authenticateToken],addWatchListStocksHandler) // !  "Convert all 'company names' to lowercase and 'company code' to uppercase before sending to backend" 
  // todo create a new middleware to check if company code and company name are valid
  
  app.post('/api/testRoute',authenticateToken,(req,res)=>{
    console.log(req.user)
    res.sendStatus(200);
  })
}

export default routes