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

app.patch("/api/users/update/:id", (req, res)=>{
  try{
    const id = parseInt(req.params.id);
    const newUser = newUserSchema.safeParse({id: id, ...req.body});
    if(!newUser.success) return res.status(400).send(newUser.error.issues);
    console.log(newUser);
    const findUser = mockDAta.find((user)=> user.id === id);
    if(!findUser) return res.status(404).send("User not found");
    console.log(findUser);
    findUser.userName = newUser.data.userName;
    findUser.displayName = newUser.data.displayName;
    res.send(findUser);
  }catch(error){
    res.status(500).send(error.message);
  }
});

app.get("/api/users/updated", (req, res)=>{
  res.send(mockDAta);

});

app.put("/api/users/change/:id", (req, res)=>{
  try{
    const id = parseInt(req.params.id);
    
    const newUser = {...newUserSchema.safeParse(req.body).data};
    if(!newUser.success) return res.status(400).send(newUser.error.issues);
    const findUser = mockDAta.findIndex((user)=> user.id === id);
    console.log(findUser);
    if(findUser === -1) return res.status(404).send("User not found");
    mockDAta[findUser] = newUser.data;
    res.send(mockDAta[findUser]);
  }catch(e){
    res.status(500).send(e.message);
  }
});

app.listen(port, ()=> 
  console.log(`listening on port ${port}`));