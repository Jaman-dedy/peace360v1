import mongoose from "mongoose";
import config from "config";
import "dotenv/config";

const db =
  process.env.NODE_ENV === "production"
    ? process.env.MONGODB_URI
    : config.get("mongoURI");
const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    });
  } catch (err) {
    throw err.message;
  }
};

export default connectDB;
