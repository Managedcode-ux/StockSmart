import {Express,Request,Response} from "express";

// USER PATH IMPORTS
import { createUserHandler,loginUserHandler,getCurrentUserHandler,updateCurrentUserHandler,deleteCurrentUserHandler} from "./controller/user.controller";


//MIDDLEWARE IMPORTS
import { authenticateToken } from "./middleware/authenticate";
import validateResource from "./middleware/validateResource";

//SCHEMA IMPORTS
import { createUserSchema } from "./schema/user.schema";
import { createSessionSchema } from "./schema/login.user.schema";



function routes(app:Express){
  app.get('/healthcheck', (req, res) => res.sendStatus(200));

  //USERS
  app.post('/api/createUsers',validateResource(createUserSchema),createUserHandler)
  app.post('/api/loginUser',validateResource(createSessionSchema),loginUserHandler)
  app.get('/api/getCurrentUser',[authenticateToken],getCurrentUserHandler)
  app.patch('/api/updateUser',[authenticateToken],updateCurrentUserHandler)
  app.delete('/api/deleteUser',[authenticateToken],deleteCurrentUserHandler)

  
  app.post('/api/testRoute',authenticateToken,(req,res)=>{
    console.log(req.user)
    res.sendStatus(200);
  })
}

export default routes