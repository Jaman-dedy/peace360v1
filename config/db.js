import mongoose from 'mongoose';
import 'dotenv/config';
const db =
  process.env.NODE_ENV === 'development'
    ? process.env.MONGO_URI_DEV
    : process.env.NODE_ENV === 'test'
    ? process.env.MONGO_URI_TEST
    : process.env.MONGODB_URI;
console.log('db', db);
const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    });
  } catch (err) {}
};
export default connectDB;
