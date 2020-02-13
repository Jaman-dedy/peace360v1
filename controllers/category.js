import Category from '../models/Category';

import statusCode from '../config/statusCode';
import { updateCategoryHelper } from '../helpers/categoryHelper';

export default class CategoryController {
  static async createCategory(req, res) {
    const { categoryTitle, description } = req.body;
    let category = new Category({ categoryTitle, description });
    const saveCategory = await category.save();
    res.status(statusCode.CREATED).json({
      status: statusCode.CREATED,
      data: saveCategory,
      message: 'Category successfully created'
    });
  }
  static async editCategory(req, res) {
    const updateCategory = await updateCategoryHelper(req);
    if (updateCategory) {
      const findNewCategory = await Category.findOne({
        _id: updateCategory._id
      });
      res.status(statusCode.OK).json({
        status: statusCode.OK,
        message: 'category updated successfully',
        data: findNewCategory
      });
    }
    res.status(statusCode.SERVER_ERROR).json({
      status: statusCode.SERVER_ERROR,
      message: error.message
    });
  }
  static async deleteCategory(req, res) {
    const { categoryTitle } = req.params;
    const deleteCat = await Category.findOneAndRemove({
      categoryTitle
    });
    deleteCat
      ? res.status(statusCode.OK).json({
          status: statusCode.OK,
          message: 'category deleted successfully',
          data: deleteCat
        })
      : res.status(statusCode.NOT_FOUND).json({
          status: statusCode.NOT_FOUND,
          errors: { message: "Category doesn't exist" }
        });
  }
  static async getAllCategory(req, res) {
    const page = parseInt(req.query.page);
    let displayCategories;
    let previousPage;
    let nextPage;
    const startIndex = (page - 1) * 3;
    const endIndex = page * 3;
    const allCategories = await Category.aggregate([
      {
        $lookup: {
          from: 'articles',
          localField: '_id',
          foreignField: 'categoryId',
          as: 'articles'
        }
      }
    ]);
    const pageNumber = Math.ceil(allCategories.length / 3);
    if (page > 1) {
      previousPage = page - 1;
    }
    if (page < pageNumber) {
      nextPage = page + 1;
    }

    displayCategories = allCategories.slice(startIndex, endIndex);
    res.status(statusCode.OK).json({
      pageInfo: {
        pageNumber,
        previousPage,
        currentPage: page,
        nextPage,
        limit: 3
      },
      status: statusCode.OK,
      message: 'Categories are successfully fetched',
      displayCategories
    });
  }
  static async getOneCategory(req, res) {
    const { categoryTitle } = req.params;
    const category = await Category.findOne({ categoryTitle });
    category
      ? res.status(statusCode.OK).json({
          status: statusCode.OK,
          message: 'Category is successfully fetched',
          data: category
        })
      : res.status(statusCode.NOT_FOUND).json({
          status: statusCode.NOT_FOUND,
          message: 'Category does not exist'
        });
  }
}
