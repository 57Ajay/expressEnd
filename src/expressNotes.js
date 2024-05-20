/////Notes 1://///
/////use in .js file/////
import express, { response } from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res)=>{
    res.status(201).send("Hello World");
});
// const mockUsers = [{id:1, "Name": "John"}, {id:2, "Name": "Doe"}, {id:3, "Name": "Jane"}];
app.get("/api/users", (req, res)=>{
    res.send(mockUsers);
});

app.get("/api/products", (req, res)=>{
    res.send([{id:1, "Name": "pasta", "price": 10}, {id:2, "Name": "pizza", "price": 15}, {id:3, "Name": "burger", "price": 20}]);
});

app.get("/api/users/:id", (req, res)=>{
    const parsedId = parseInt(req.params.id);
    if (isNaN(parsedId)) return res.status(400).send("Invalid ID");
    const findUser = mockUsers.find((user)=> user.id === parsedId);
    if (!findUser) return res.sendStatus(404);
    return res.send(findUser);
});

app.listen(PORT, ()=>{
    console.log("Running on port", PORT);
});

/////////////////////////////////////////
/*Server for filtering out from query
with ?filter=Name&value=Il  will give
[
    {
        "id": 10,
        "Name": "Illiya",
        "displayName": "illiya"
    }
] */


import express, { response } from 'express';

// const app = express();
// const PORT = process.env.PORT || 3000;

app.get("/", (req, res)=>{
    res.status(201).send("Hello World");
});

const mockUsers =
 [{id:1, "Name": "John", "displayName": "John"},
  {id:2, "Name": "Doe","displayName": "doe"},
  {id:3, "Name": "Jane","displayName": "jane"},
  {id:4, "Name": "Chris","displayName": "chris"},
  {id:5, "Name": "Tony","displayName": "tony"},
  {id:6, "Name": "Laura","displayName": "laura"},
  {id:7, "Name": "Jane","displayName": "jane"},
  {id:8, "Name": "Yashvi","displayName": "Yashvi"},
  {id:9, "Name": "Sam","displayName": "sam"},
  {id:10, "Name": "Illiya","displayName": "illiya"}];
app.get("/api/users", (req, res)=>{
    console.log(req.query);
    const {query: {filter, value}} = req;
    //when filter and value are undefined
    if (!filter && !value) return res.send(mockUsers);
    if (filter && value) return res.send(mockUsers.filter((user)=>
        user[filter].includes(value)));
    });
    

app.get("/api/products", (req, res)=>{
    res.send([{id:1, "Name": "pasta", "price": 10}, {id:2, "Name": "pizza", "price": 15}, {id:3, "Name": "burger", "price": 20}]);
});

app.get("/api/users/:id", (req, res)=>{
    const parsedId = parseInt(req.params.id);
    if (isNaN(parsedId)) return res.status(400).send("Invalid ID");
    const findUser = mockUsers.find((user)=> user.id === parsedId);
    if (!findUser) return res.sendStatus(404);
    return res.send(findUser);
});

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
      res.status(201).send(newUser);
    }catch(e){
      res.status(400).send(e.message);
    }
  })
  
  app.get('/api/users/get', (req, res)=>{
    res.send(mockDAta);
  })

app.listen(PORT, ()=>{
    console.log("Running on port", PORT);
});


/////////////////////////////////////////


//Adding some simple and effective methods on Users data
//With express and zod
/*
import express from "express";

const app = express();

// app.use(express.json());
const newUserSchema = object({
  userName: string(),
  displayName: string(),
});
const port = 3000;
*/
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

app.get("/api/users/userName", (req, res) => {
  const filter = req.query.filter;
  if (!filter) return res.send("Provide filter query to filter by userName");
  const filteredUsers = mockDAta.filter((user)=>
  user.userName.toLowerCase().includes(filter.toLowerCase()));
  if (filteredUsers.length === 0) return res.send("User(s) not found");
  res.send(filteredUsers);
})


// to find users via userName or DisplayName
// filter=userName&value=j (example query)

app.get("/api/users", (req, res)=>{
  const { query: {filter, value}} = req;
  if (!filter && !value) return res.send(mockDAta);
  if (filter && value) return res.send(mockDAta.filter((user)=> user[filter].includes(value)));
})
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
  
  

// app.listen(port, ()=> 
//   console.log(`listening on port ${port}`));
