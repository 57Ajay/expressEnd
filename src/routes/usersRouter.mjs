import { Router } from "express";
import { mockUserData} from "../utils/constants.mjs";

import { check, validationResult, query, body, matchedData, checkSchema } from "express-validator";
import { createUserSchema } from "../utils/validationSchemas.mjs";
import { loggingMiddleware } from "../middlewares/usersMiddlewares/loggingMiddleware.mjs";
import { resolveIndexByUserId } from "../middlewares/usersMiddlewares/resolveIndexByUserId.mjs";
import { duplicateCheckMiddleware } from "../middlewares/usersMiddlewares/duplicateCheckMiddleware.mjs";
import { newUserSchema } from "../schemas/newUserSchema.mjs";

const router = Router();
  
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

router.delete("/api/users/:id", resolveIndexByUserId, (req, res)=>{
    const { findUserIndex } = req;
    const userToBeDeleted = mockUserData[findUserIndex];
    mockUserData.splice(findUserIndex, 1);
    res.status(200).json({msg: "User deleted",
    deletedUser: userToBeDeleted,
    });
});

router.patch("/api/users/:id", resolveIndexByUserId, (req, res)=>{
    const { findUserIndex } = req;
    const userToBeUpdated = mockUserData[findUserIndex];
    mockUserData[findUserIndex] = { ...userToBeUpdated, ...req.body };
    res.status(200).json({msg: "User updated",
    userToBeUpdated: userToBeUpdated,
    newUpdatedUserData: mockUserData[findUserIndex],
    });
});

export default router;