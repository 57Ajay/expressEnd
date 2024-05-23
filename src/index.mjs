import express from 'express';
import usersRouter from './routes/users.mjs';

const app = express(); 
const port = 3000;

app.use(express.json())
app.use(usersRouter);

app.listen(port, () => console.log(`Server is listening on port ${port}`));