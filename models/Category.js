import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const CategorySchema = new mongoose.Schema({
  categoryTitle: {
    type: String,
    unique: true,
    required: true
  },
  description: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Category', CategorySchema);
