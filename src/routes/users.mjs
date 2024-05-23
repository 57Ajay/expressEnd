import { Router } from "express";
import { mockUserData} from "../utils/constants.mjs";
import { object, string } from "zod";
import { check, validationResult, query, body, matchedData, checkSchema } from "express-validator";
import { createUserSchema } from "../utils/validationSchemas.mjs";

const router = Router();

const newUserSchema = object({
    userName: string(),
    displayName: string(),
});

const loggingMiddleware = (req, res, next) => {
    console.log(`${req.method} - ${req.url}`);
    next();
  };
  
  /** A Middleware which gets user index whose id is 
   * same as the id in the url this middleware will pass that index
   * to the next middleware or the url with which it was called
   */
  
  const resolveIndexByUserId = (req, res, next)=>{
    const {params: {id}} = req;
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) return res.sendStatus(400);
    const findUserIndex = mockUserData.findIndex((user) => user.id === parsedId);
    if (findUserIndex === -1) return res.sendStatus(404);
    req.findUserIndex = findUserIndex;
    next();
  };
  
  /** A middleware which checks if the user already exists */
  
  const duplicateCheckMiddleware = (req, res, next)=>{
    const {body: newUser} = req;
    const duplicate = mockUserData.find((user)=> user.userName === newUser.userName);
    if(duplicate){
      res.sendStatus(409);
      console.log("duplicate");
      return;
    }
    next();
  };
  
  
  
router.get("/api/users", checkSchema(createUserSchema), (req, res) => {
    const errors = validationResult(req);
    console.log(errors);
    const {query: {filter, value}} = req;
    if (!filter && !value) return res.send(mockUserData);
    if (!filter || !value) return res.json({
      msg: "Provide both filter and value",
      context: "filter can be userName and displayName and value can be anything but it should be a string",
      example: "/api/users?filter=userName&value=John"});
  
    if (filter && value) return res.send(mockUserData.filter((user)=> user[filter].toLowerCase().includes(value.toLowerCase())));
    next();
});

export default router