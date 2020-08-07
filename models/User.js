import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
    required: false,
  },
  avatar: {
    type: String,
  },
  bio: {
    type: String,
    default: "",
  },
  company: {
    type: String,
    default: "",
  },
  website: {
    type: String,
    default: "",
  },
  address: {
    type: String,
    default: "",
  },
  occupation: {
    type: String,
    default: "",
  },
  youtube: {
    type: String,
    default: "",
  },
  twitter: {
    type: String,
    default: "",
  },
  facebook: {
    type: String,
  },
  linkedin: {
    type: String,
    default: "",
  },
  instagram: {
    type: String,
    default: "",
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("User", UserSchema);
