import mongoose, { mongo } from 'mongoose';
import config from 'config';

const db = config.get('mongoURI');

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false
    });
  } catch (err) {
    throw err.message;
    //Exit process with failure
    process.exit(1);
  }
};

export default connectDB;
