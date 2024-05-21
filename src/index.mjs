import express from "express";
import { number, object, string } from "zod";


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
const resolveIndexByUserId = (req, res, next)=>{
  const {params: {id}} = req;
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) return res.sendStatus(400);
  const findUserIndex = mockUserData.findIndex((user) => user.id === parsedId);
  if (findUserIndex === -1) return res.sendStatus(404);
  req.findUserIndex = findUserIndex;
  next();
};

const duplicateCheckMiddleware = (req, res, next)=>{
  const {body: newUser} = req;
  const duplicate = mockUserData.find((user)=> user.userName === newUser.userName);
  if(duplicate){
    res.sendStatus(409);
    console.log("duplicate Users cannot be created");
    return;
  }
  next();
}

app.use(loggingMiddleware, (req, res, next)=>{
  console.log("finished logging ....");
  next();
});

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


app.get("/users", (req, res) => {
  res.json(mockUserData);
});

app.get("/users/:id", resolveIndexByUserId, (req, res, next)=>{
  const {findUserIndex} = req;
  res.send(mockUserData[findUserIndex]);
  next();
});

app.post("/users", duplicateCheckMiddleware, (req, res, next) => {
  const id = mockUserData.length + 1;
  const newUser = {id : id, ...newUserSchema.parse(req.body)};
  mockUserData.push(newUser);
  console.log(newUser);
  res.status(201).send(newUser);
  next();
});

app.listen(port, ()=> 
  console.log(`listening on port ${port}`));