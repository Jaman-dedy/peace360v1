import express from 'express';
import Category from '../../controllers/category';
import {
  checkCategoryExist,
  checkCategoryNotExist
} from '../../middlewares/categoryMiddleware';
import isAuthenticated from '../../middlewares/auth';

const router = express.Router();

router.post(
  '/create',
  isAuthenticated,
  checkCategoryExist,
  Category.createCategory
);
router.patch(
  '/update/:categoryTitle',
  isAuthenticated,
  checkCategoryNotExist,
  checkCategoryExist,
  Category.editCategory
);
router.delete(
  '/delete/:categoryTitle',
  isAuthenticated,
  Category.deleteCategory
);
router.get('/getAll', Category.getAllCategory);
router.get('/getOne/:categoryTitle', Category.getOneCategory);
export default router;
