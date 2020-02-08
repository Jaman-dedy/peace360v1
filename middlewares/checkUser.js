import User from '../models/User';
import Article from '../models/Article';
import bcrypt from 'bcryptjs';

const checkUser = async (req, res, next) => {
  const { username, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res
        .status(409)
        .json({ errors: [{ message: 'User already exists' }] });
    }
    let checkUsername = await User.findOne({ username });
    if (checkUsername) {
      return res.status(409).json({
        errors: [
          { message: 'Username already taken, kindly provide a new one' }
        ]
      });
    }
    next();
  } catch (error) {
    res.status(500).json({ status: 500, error: error.message });
  }
};

const checkUserLogin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ errors: [{ status: 400, message: 'Invalid email address' }] });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ errors: [{ status: 400, message: 'Invalid password' }] });
    }
    next();
  } catch (error) {
    res.status(500).json({ status: 500, error: error.message });
  }
};

const checkUserFavoriteArticle = async (req, res, next) => {
  const user = req.user.id;
  const _id = req.params.article_id;
  try {
    const article = await Article.findOne({ _id });
    if (article.user == user) {
      return res.status(401).json({
        status: 401,
        error: "You can't favorite your own item"
      });
    }
    next();
  } catch (error) {
    res.status(500).json({
      status: 500,
      error: error.message
    });
  }
};

export { checkUser, checkUserLogin, checkUserFavoriteArticle };
