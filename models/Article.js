import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: "categories",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  subTitle: {
    type: String,
  },
  user: {
    id: String,
    username: String,
    email: String,
    avatar: String,
  },
  text: {
    type: String,
  },
  tags: [String],
  avatar: {
    type: String,
  },
  coverPhoto: {
    type: String,
  },
  inTextPhoto: {
    type: String,
  },
  approved: {
    type: Boolean,
    default: false,
  },
  likes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
      articleId: {
        type: Schema.Types.ObjectId,
        ref: "articles",
      },
      name: {
        type: String,
      },
      avatar: {
        type: String,
      },
    },
  ],
  ratings: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
      name: {
        type: String,
      },
      avatar: {
        type: String,
      },
      rate: {
        type: Number,
      },
    },
  ],
  readTime: {
    type: String,
  },
  comments: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
      text: {
        type: String,
        required: true,
      },
      name: {
        type: String,
      },
      avatar: {
        type: String,
      },
      image: {
        type: String,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

ArticleSchema.index({ "$**": "text" });
export default mongoose.model("Article", ArticleSchema);
