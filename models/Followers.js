import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const FollowerSchema = new Schema({
  following: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  follower: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  }
});

export default mongoose.model('follower', FollowerSchema);