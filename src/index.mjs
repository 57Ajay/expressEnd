import express from "express";

const app = express();

// app.use(express.json());
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

app.get("/api/users/userName", (req, res) => {
  const filter = req.query.filter;
  if (!filter) return res.send("Provide filter query to filter by userName");
  const filteredUsers = mockDAta.filter((user)=>
  user.userName.includes(filter));
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


app.listen(port, ()=> 
  console.log(`listening on port ${port}`));