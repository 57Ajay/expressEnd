import express from 'express';
import routes from './routes/index.mjs';
import cookieParser from 'cookie-parser';


const app = express(); 
app.use(cookieParser("Ajay"));
const port = process.env.PORT || 3000;

app.use(express.json())
app.use(routes);

app.get('/', (req, res) => {
    res.cookie("hello", "world", {maxAge: 100000, httpOnly: true, signed: true}).send("Hello World");

});

app.listen(port, () => console.log(`Server is listening on port ${port}`));