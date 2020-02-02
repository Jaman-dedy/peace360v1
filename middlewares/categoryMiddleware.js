import Category from '../models/Category.js';
import statusCode from '../config/statusCode';

const checkCategoryExist = async (req, res, next) => {
  const { categoryTitle } = req.body;
  try {
    let findCategory = await Category.findOne({ categoryTitle });
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
export { checkCategoryExist };
