import {Express,Request,Response} from "express";
import { createUserHandler } from "./controller/user.controller";
import { authenticateToken } from "./middleware/authenticate";
import { loginUserHandler } from "./controller/user.controller";
import validateResource from "./middleware/validateResource";
import { createUserSchema } from "./schema/user.schema";
import { createSessionSchema } from "./schema/login.user.schema";

function routes(app:Express){
  app.get('/healthcheck', (req, res) => res.sendStatus(200));

  //USERS
  app.post('/api/createUsers',validateResource(createUserSchema),createUserHandler)
  app.post('/api/loginUser',validateResource(createSessionSchema),loginUserHandler)
  // app.post('/api/anyRoute',[authenticateToken],getCurrentUser)
  // app.post('/api/anyRoute',[authenticateToken],updateCurrentUser)
  // app.post('/api/anyRoute',[authenticateToken],deleteCurrentUser)

  
  app.post('/api/testRoute',authenticateToken,(req,res)=>{
    console.log(req.user)
    res.sendStatus(200);
  })
}

export default routes