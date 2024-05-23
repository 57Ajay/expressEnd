import express from 'express';
import routes from './routes/index.mjs';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { mockUserData } from './utils/constants.mjs';

const app = express(); 
app.use(session({
    secret: "Ajay",
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: 60000*60}
}));
app.use(cookieParser("Ajay"));
const port = process.env.PORT || 3000;

app.use(express.json())
app.use(routes);

app.get('/', (req, res) => {
    console.log(req.session, req.session.id);
    req.session.visited = true;
    res.cookie("hello", "world", {maxAge: 10000, httpOnly: true, signed: true}).send("Hello World");
});

app.post("/api/auth", (req, res) => {
    const { body: {userName, password} } = req;
    const findUser = mockUserData.find((user)=> user.userName === userName);
    if (!findUser) return res.status(401).send("User not found");
    if (findUser.password !== password) return res.status(401).send("Incorrect password");
    req.session.user = findUser;
    return res.status(200).send(findUser);
});

app.get("/api/auth/status", (req, res) => {
    req.sessionStore.get(req.session.id, (err, sessionData) => {
        if (err) {console.log(err); throw err};
        console.log(sessionData);
    })
    return req.session.user ? res.status(200).send(req.session.user) : res.status(401).send("Unauthorized");
});

app.post("/api/cart", (req, res)=>{
    if(!req.session.user) return res.status(401).send("Unauthorized");
    const {body: item} = req;
    const { cart } = req.session;
    if (cart){
        cart.push(item);
    }else{
    req.session.cart = [item];
    }
    return res.status(201).send(item)
});

app.get("/api/cart", (req, res)=>{
    console.log(req.session.user);
    if(!req.session.user) return res.status(401).send("Unauthorized");
    return res.status(200).send(req.session.cart ?? []);
});


app.listen(port, () => console.log(`Server is listening on port ${port}`));