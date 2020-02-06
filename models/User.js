import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    sparse: true
  },
  email: {
    type: String,
    required: false,
    unique: true
  },
  password: {
    type: String,
    required: false
  },
  avatar: {
    type: String
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  date: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('User', UserSchema);
