import { validationResult } from 'express-validator';
import fs, { read } from 'fs';
import Article from '../models/Article';
import cloudinary from '../helpers/fileUpoadConfig/cloudinary';
import User from '../models/User';
import Category from '../models/Category';

class ArticleController {
  async createArticle(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    try {
      const uploader = async (path) => await cloudinary.uploads(path, 'Images');
      const urls = [];
      const files = req.files ? req.files : [];
      for (const file of files) {
        const { path } = file;
        const newPath = await uploader(path);
        urls.push(newPath);
        fs.unlinkSync(path);
      }
      const coverPhoto = files.length ? urls[0].url : undefined;
      const inTextPhoto = files.length == 2 ? urls[1].url : undefined;
      const user = await User.findById(req.user.id).select('-password');
      const newArticle = new Article({
        text: req.body.text,
        categoryId: req.body.categoryId,
        title: req.body.title,
        subTitle: req.body.subTitle,
        tags: req.body.tags,
        coverPhoto,
        inTextPhoto,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
        },
      });
      const article = await newArticle.save();

      res.status(201).json({
        status: 201,
        data: article,
        message: 'You successfully created an article',
      });
    } catch (err) {
      console.log('err', err);
      res.status(500).json({
        status: 500,
        error: err,
      });
    }
  }

  async getAllArticle(req, res) {
    try {
      const page = parseInt(req.query.page);
      let displayed;
      const articles = await Article.find({ approved: true }).sort({
        date: -1,
      });
      const startIndex = (page - 1) * 5;
      const endIndex = page * 5;
      displayed = articles.slice(startIndex, endIndex);
      res.status(200).json({
        status: 200,
        displayed,
        message: 'You successfully fetched the articles',
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        error: error,
      });
    }
  }
  async getArticles(req, res) {
    try {
      const articles = await Article.find().sort({
        date: -1,
      });
      res.status(200).json({
        status: 200,
        articles,
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        error: error,
      });
    }
  }

  async getOneArticle(req, res) {
    try {
      const article = await Article.findById(req.params.article_id);
      if (!article) {
        return res.status(404).json({
          status: 404,
          error: 'Item not found',
        });
      }
      res.status(200).json({
        status: 200,
        article,
      });
    } catch (err) {
      if (err.kind === 'ObjectId') {
        return res.status(404).json({
          status: 404,
          error: 'Item not found',
        });
      }
      return res.status(500).json({
        status: 500,
        error: 'Server error',
      });
    }
  }
  async updateArticle(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    try {
      const article = await Article.findById(req.params.article_id);
      if (!article) {
        return res.status(404).json({
          status: 404,
          error: 'Item not found',
        });
      }
      if (article.user.toString() !== req.user.id) {
        return res.status(401).json({
          status: 401,
          error: 'Action denied',
        });
      }
      const updatedArticle = {
        text: req.body.text,
      };
      const articleUpdated = await Article.findOneAndUpdate(
        { _id: req.params.article_id },
        updatedArticle
      );
      res.status(200).json({ status: 200, updatedArticle });
    } catch (error) {
      res.status(500).json({
        status: 500,
        error: error,
      });
    }
  }
  async deleteOneArticle(req, res) {
    try {
      const article = await Article.findById(req.params.article_id);
      if (article.user.toString() !== req.user.id) {
        return res.status(401).json({
          status: 401,
          error: 'Action denied',
        });
      }
      if (!article) {
        return res.status(404).json({
          status: 404,
          error: 'Item not found',
        });
      }
      await article.remove();
      return res.status(200).json({
        status: 200,
        error: 'Article removed',
      });
    } catch (err) {
      if (err.kind === 'ObjectId') {
        return res.status(404).json({
          status: 404,
          error: 'Item not found',
        });
      }
      return res.status(500).json({
        status: 500,
        error: 'Server error',
      });
    }
  }
  async likeArticle(req, res) {
    try {
      const article = await Article.findById(req.params.article_id);
      //check on the user who likes the current article

      if (
        article.likes.filter((like) => like.user.toString() === req.user.id)
          .length > 0
      ) {
        const removeIndex = article.likes
          .map((like) => like.user.toString())
          .indexOf(req.user.id);
        article.likes.splice(removeIndex, 1);
        await article.save();
        const disliked = article.likes;
        return res.status(200).json({
          status: 200,
          message: 'Article disliked',
          state: 'dislike',
        });
      }
      const newLike = {
        user: req.user.id,
        articleId: req.params.article_id,
        username: req.user.username,
        avatar: req.user.avatar,
      };
      article.likes.unshift(newLike);
      await article.save();
      const liked = article.likes;
      return res.status(200).json({
        status: 200,
        message: 'Article liked',
        state: 'like',
        liked,
      });
    } catch (error) {
      if (error.kind === 'ObjectId') {
        return res.status(404).json({
          status: 404,
          error: 'Item not found',
        });
      }
      return res.status(500).json({
        status: 500,
        error: error.message,
      });
    }
  }
  async rateArticle(req, res) {
    try {
      const article = await Article.findById(req.params.article_id);
      const newRate = {
        user: req.user.id,
        name: req.user.name,
        avatar: req.user.avatar,
        rate: req.body.rate,
      };
      if (
        article.ratings.filter(
          (rating) => rating.user.toString() === req.user.id
        ).length > 0
      ) {
        const removeIndex = article.ratings
          .map((rating) => rating.user.toString())
          .indexOf(req.user.id);
        article.ratings.splice(removeIndex, 1, newRate);
        await article.save();
        const rating = article.ratings[0];
        return res.status(201).json({
          status: 201,
          rating,
        });
      }
      article.ratings.unshift(newRate);
      await article.save();
      const rating = article.ratings[0];
      return res.status(201).json({
        status: 201,
        rating,
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        error: error,
      });
    }
  }
  async approveArticle(req, res) {
    try {
      let approve;
      const article = await Article.findById(req.params.article_id);
      approve = article.approved;
      const updateApproval = {
        approved: !approve,
      };
      const approveArticle = await Article.findOneAndUpdate(
        { _id: req.params.article_id },
        updateApproval
      );
      approve = approveArticle.approved;
      res.status(200).json({ status: 200, updateApproval });
    } catch (error) {
      res.status(500).json({
        status: 500,
        error: error,
      });
    }
  }
}

export default ArticleController;
