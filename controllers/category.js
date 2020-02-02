import Category from '../models/Category';
import statusCode from '../config/statusCode';

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
    const { categoryTitle, description } = req.body;
    const updateCategory = await Category.findOneAndUpdate(
      { categoryTitle: req.params.categoryTitle },
      {
        categoryTitle,
        description
      }
    );
    updateCategory
      ? res.status(statusCode.OK).json({
          status: statusCode.OK,
          message: 'category updated successfully',
          data: updateCategory
        })
      : res.status(statusCode.NOT_FOUND).json({
          status: statusCode.NOT_FOUND,
          errors: { message: "Category doesn't exist" }
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
    const allCategories = await Category.find({});
    if (allCategories.length === 0) {
      res.status(statusCode.NOT_FOUND).json({
        status: statusCode.NOT_FOUND,
        message: 'No categories so far'
      });
    }
    res.status(statusCode.OK).json({
      status: statusCode.OK,
      message: 'Categories are successfully fetched',
      data: allCategories
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
