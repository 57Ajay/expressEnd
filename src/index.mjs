import express from "express";
import { object, string, number } from "zod";


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

app.post('/api/users/add', (req, res)=>{
  try{
    const id = mockDAta.length + 1;
    const newUser = {id: id, ...newUserSchema.parse(req.body)};
    const duplicate = mockDAta.find((user)=> user.userName === newUser.userName);
    if(duplicate){
      throw new Error("User already exists");
    }
    mockDAta.push(newUser);
    console.log(newUser);
    res.send(newUser);
  }catch(e){
    res.status(400).send(e.message);
  }
})

app.get('/api/users/get', (req, res)=>{
  res.send(mockDAta);
})


app.listen(port, ()=> 
  console.log(`listening on port ${port}`));