import express from 'express';
import routes from './routes/index.mjs';
import cookieParser from 'cookie-parser';
import session from 'express-session';

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

app.listen(port, () => console.log(`Server is listening on port ${port}`));