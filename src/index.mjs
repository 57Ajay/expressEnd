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

app.put("/api/users/change/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id); // Extract id from URL
    const newUser = {id: req.body.id,/*or just id or id: id for old id value */ ...newUserSchema.safeParse(req.body).data }; // Merge id with parsed body data
    const validationResult = newUserSchema.safeParse(req.body);
    if (!validationResult.success) return res.status(400).send(validationResult.error.issues);
    const findUserIndex = mockDAta.findIndex((user) => user.id === id);
    if (findUserIndex === -1) return res.status(404).send("User not found");
    mockDAta[findUserIndex] = newUser;
    res.send(mockDAta[findUserIndex]);
  } catch (e) {
    res.status(500).send(e.message);
  }
});


app.get("/api/users/data", (req, res) => {
  try {
    res.send(mockDAta);
  } catch (e) {
    res.status(500).send(e.message);
  }
});


app.listen(port, ()=> 
  console.log(`listening on port ${port}`));