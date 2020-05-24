import express from 'express';
import passport from 'passport';
import cors from 'cors';
import bodyParser from 'body-parser';
import connectDB from './config/db';
import router from './routes/app';
import multer from 'multer';

const app = express();
const upload = multer();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors());

app.use(upload.array()); 
app.use(express.static('public'));
//Connect to the db
connectDB();

//Init Middlware

app.use(express.json({ extended: false }));

app.use(passport.initialize());

app.use(router);
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`server up on port ${port}`));

export default app;
