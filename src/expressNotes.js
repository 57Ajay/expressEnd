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

app.listen(PORT, ()=>{
    console.log("Running on port", PORT);
});


/////////////////////////////////////////


