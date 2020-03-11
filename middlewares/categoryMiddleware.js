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
  const { categoryTitle } = req.params;
  try {
    let findCategory = await Category.findOne({ categoryTitle: categoryTitle });
    !findCategory
      ? res.status(statusCode.EXIST).json({
          errors: [{ message: 'Category does not exist' }]
        })
      : next();
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
    let findCategory = await Category.findOne({ categoryTitle: title });

    if (!findCategory) {
      res.status(statusCode.EXIST).json({
        errors: [{ message: 'Category does not exist' }]
      });
    } else {
      if (categoryTitle === findCategory.categoryTitle) {
        next();
      } else {
        res.status(statusCode.EXIST).json({
          errors: [{ message: 'Category title already exist' }]
        });
      }
    }
  } catch (error) {
    res.status(statusCode.SERVER_ERROR).json({
      status: statusCode.SERVER_ERROR,
      message: error.message
    });
  }
};
export { checkCategoryExist, checkCategoryNotExist, updateCategoryMiddleware };
