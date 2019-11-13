import dotenv from "dotenv";

dotenv.config();

const email = {
  user: process.env.SENDER_EMAIL,
  pass: process.env.SENDER_PASS
};

const development = {
  MONGODB_URI: process.env.MONGO_URI_DEV,
  host: process.env.DEV_URI
};
const production = {
  MONGODB_URI: process.env.MONGODB_URI
};

export { email, development, production };
