import Category from '../models/Category.js';
import statusCode from '../config/statusCode';
import mongoose from 'mongoose';

const checkCategoryExist = async (req, res, next) => {
  const { categoryTitle } = req.body;
  try {
    let findCategory = await Category.findOne({ categoryTitle: categoryTitle });
    !findCategory
      ? next()
      : res.status(statusCode.EXIST).json({
          errors: [{ message: 'Category already exists' }]
        });
  } catch (error) {
    res.status(statusCode.SERVER_ERROR).json({
      status: statusCode.SERVER_ERROR,
      message: error.message
    });
  }
};
const checkCategoryNotExist = async (req, res, next) => {
  try {
    let findCategory = await Category.findOne({
      categoryTitle: req.params.title
    });
    if (!findCategory) {
      res.status(statusCode.EXIST).json({
        errors: [{ message: 'Category does not exist' }]
      });
    }
     next();
  } catch (error) {
    res.status(statusCode.SERVER_ERROR).json({
      status: statusCode.SERVER_ERROR,
      message: error.message
    });
  }
};
const updateCategoryMiddleware = async (req, res, next) => {
  const { categoryTitle } = req.body;
  const { title } = req.params;
  try {
    const categoryExist = await Category.findOne({ categoryTitle });
    if (categoryExist && title !== categoryTitle) {
      res.status(statusCode.EXIST).json({
        errors: [{ message: 'Category already exists' }]
      });
    }
    next();
  } catch (error) {
    res.status(statusCode.SERVER_ERROR).json({
      status: statusCode.SERVER_ERROR,
      message: error.message
    });
  }
};
export { checkCategoryExist, checkCategoryNotExist, updateCategoryMiddleware };
