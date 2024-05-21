// middleware notes

import express from "express";
import { object, string } from "zod";
import { check, validationResult, query, body, matchedData, checkSchema } from "express-validator";
import { createUserSchema } from './utils/validationSchemas.mjs'


const app = express();
app.use(express.json());
const port = 3000;

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

const mockUserData =[
  {id: 1, userName: "James", displayName: "James"},
  {id: 2, userName: "William", displayName: "william"},
  {id: 3, userName: "John", displayName: "John"},
  {id: 4, userName: "Johnny", displayName: "johnny"},
  {id: 5, userName: "jimmy", displayName: "jimmy"},
  {id: 6, userName: "Doe", displayName: "Doe"},
  {id: 7, userName: "Jane", displayName: "Jane"},
  {id: 8, userName: "Chris", displayName: "Chris"},
  {id: 9, userName: "Tony", displayName: "Tony"},
  {id: 10, userName: "Laura", displayName: "Laura"},
];

app.get("/users", loggingMiddleware, (req, res) => {
  res.json(mockUserData);
});


app.get("/users/:id", resolveIndexByUserId, (req, res, next)=>{
  const {findUserIndex} = req;
  res.send(mockUserData[findUserIndex]);
  next();
});

app.get("/api/users", query("filter").isString().notEmpty().optional(), query("value").isString().notEmpty().isLength({min: 1}).optional(), (req, res, next) => {
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


app.put("/users/:id", resolveIndexByUserId, (req, res, next) => {
  const {findUserIndex} = req;
  const {userName, displayName} = newUserSchema.parse(req.body);

  const userToBeUpdated = mockUserData[findUserIndex];

  mockUserData[findUserIndex] = {id:parseInt(req.params.id) ,userName, displayName};
  res.status(200).json({
    msg: "User updated",
    userToBeUpdated: userToBeUpdated,
    newUpdatedUserData: mockUserData[findUserIndex],
  });
  next();
})

app.patch("/users/:id", resolveIndexByUserId, (req, res, next)=>{
  const {body, findUserIndex} = req;
  mockUserData[findUserIndex] = {...mockUserData[findUserIndex], ...body};
  res.send(mockUserData[findUserIndex]);
  next();
})

app.delete("/users/:id", resolveIndexByUserId, (req, res, next)=>{
  const {findUserIndex} = req;
  const userToBeDeleted = mockUserData[findUserIndex];
  mockUserData.splice(findUserIndex, 1)
  res.status(200).json({
    msg: "User deleted",
    DeletedUserData: userToBeDeleted
  });
  next();
})
/** In below post request cleaner way to use express validation is to use checkSchema() function where pass the schema like i have creates a schema in utils/validationSchemas.mjs file which can be imported and use in checkSchema(createUserSchema) and this will validate the request body by getting the data it need from the schema object
 * ex: replace "[ check("userName").exists().isString().notEmpty(), check("displayName").exists().isString().notEmpty()]" ====> with "checkSchema(createUserSchema);"
 */


app.post("/users", [
  check("userName")
    .exists()
    .isString()
    .notEmpty(),
  check("displayName")
    .exists()
    .isString()
    .notEmpty(),
], duplicateCheckMiddleware, (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const data = matchedData(req);
  console.log(data);
  
  const id = mockUserData.length + 1;
  const newUser = {id : id, ...newUserSchema.parse(req.body)};
  mockUserData.push(newUser);
  console.log(newUser);
  res.status(201).send(newUser);
  next();
});

app.listen(port, ()=> 
  console.log(`listening on port ${port}`));