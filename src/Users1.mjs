import express from "express";
import { object, number, string } from "zod";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const usersSchema = object({
    id: number(),
    name: string(),
    email: string().email(),
    password: string(),
});

const users = [
    { id: 1, name: "John", email: "john@example.com", password: "secret" },
    { id: 2, name: "Jane", email: "jane@example.com", password: "secret1" },
    { id: 3, name: "Jack" , email: "jack@example.com", password: "secret2" },
    { id: 4, name: "Jill" , email: "jill@example.com", password: "secret3" },
];

app.get("/users", (req, res) => {
    res.send(users);
});

app.post("/users", (req, res) => {
    try {
        const user = usersSchema.parse(req.body);
        if (users.some(u => u.email === user.email || u.id === user.id)) {
            throw new Error();
        }else{
        users.push(user); // Add the parsed user to the users array
        res.send(users.map((user)=> user));
        }
    } catch (error) {
        res.status(400).json({
            message: "Invalid user data or Schema",
            error: "User might already exist or id might not be unique"
        });
    }
});

app.get("/users/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const user = users.find(user => user.id === id);
    if (user) {
        res.send(user);
    } else {
        res.status(404).send("User not found");
    }
});

app.put("/users/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const userIndex = users.findIndex(user => user.id === id);
    if (userIndex !== -1) {
        try {
        const newUser = usersSchema.parse(req.body);
        users[userIndex] = newUser;
        res.send(users[userIndex]);
        }

        catch (error) {
            res.status(400).json({
                message: "Invalid user data",
                error: "User data does not match schema"
            });
        }

    } else {
        res.status(404).send("User not found");
    }
});

app.delete("/users/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const userIndex = users.findIndex(user => user.id === id);
    if (userIndex !== -1) {
        users.splice(userIndex, 1);
        res.send("User deleted");
    } else {
        res.status(404).send("User not found");
    }
});

app.listen(port, () => {
    console.log(`Running on port ${port}`);
});
