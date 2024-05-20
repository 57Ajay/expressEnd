import express from "express";
import { object, string, number, boolean } from "zod";


const app = express();
app.use(express.json());
const newUserSchema = object({
  userName: string(),
  displayName: string(),
});


const port = 3000;

const mockDAta =[
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

app.delete("/users/delete/:id", (req, res) =>{
  const id = parseInt(req.params.id); // Parse the id correctly
  const findUser = mockDAta.findIndex((user)=> user.id === id);
  if (findUser === -1) { // Check if the user exists
    return res.status(404).json({ message: "User not found" });
  }
  const deletedUser = mockDAta[findUser]; // Retrieve the user before splicing
  mockDAta.splice(findUser, 1);
  res.status(200).json({
    message: "User deleted successfully",
    deletedUser: deletedUser
  });
});


app.get("/users/remain", (req, res) =>{
  res.status(200).json(mockDAta);
});

app.listen(port, ()=> 
  console.log(`listening on port ${port}`));