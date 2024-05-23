import { Router } from "express";
import { mockUserData} from "../utils/constants.mjs";
import { object, string } from "zod";
import { check, validationResult, query, body, matchedData, checkSchema } from "express-validator";
import { createUserSchema } from "../utils/validationSchemas.mjs";
const newUserSchema = object({
    userName: string(),
    displayName: string(),
});

const router = Router();



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
      res.status(409).json({msg: "User already exists",
      context: "userName and displayName should be unique",
      });
      console.log("duplicate");
      return;
    }
    next();
};
  
router.get("/users", loggingMiddleware, (req, res) => {
    res.json(mockUserData);
});
  
router.get("/api/users",loggingMiddleware, checkSchema(createUserSchema), (req, res) => {
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

router.get("/api/users/:id", resolveIndexByUserId, (req, res) => {
    const { findUserIndex } = req;
    res.json(mockUserData[findUserIndex]);
});


router.put("/api/users/:id", resolveIndexByUserId, (req, res, next) => {
    const { findUserIndex } = req;
    const result = newUserSchema.safeParse(req.body);
    
    if (!result.success) {
      return res.status(400).json({ errors: result.error.issues });
    }
    const { userName, displayName } = result.data;
    const userToBeUpdated = mockUserData[findUserIndex];
    mockUserData[findUserIndex] = { id: parseInt(req.params.id), userName, displayName };
    res.status(200).json({
      msg: "User updated",
      userToBeUpdated: userToBeUpdated,
      newUpdatedUserData: mockUserData[findUserIndex],
    });
    next();
});

router.post("/api/users", duplicateCheckMiddleware, (req, res)=>{
    const body  = newUserSchema.safeParse(req.body);
    if(!body.success) return res.status(400).json({errors: body.error.issues});
    mockUserData.push({id: mockUserData.length + 1, ...body.data});
    res.status(201).json({msg:"User created", data: body.data});
});



export default router;