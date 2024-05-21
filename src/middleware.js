// middleware notes

import express from "express";
import { object, string } from "zod";


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


app.listen(port, ()=> 
  console.log(`listening on port ${port}`));