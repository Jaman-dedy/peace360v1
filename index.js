import express from 'express';
import passport from 'passport';
import cors from 'cors';
import connectDB from './config/db';
import router from './routes/app';

const app = express();
app.use(cors());

//Connect to the db
connectDB();

//Init Middlware

app.use(express.json({ extended: false }));

app.use(passport.initialize());

app.use(router);
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`server up on port ${port}`));

export default app;
