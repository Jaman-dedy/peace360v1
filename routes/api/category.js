import express from 'express';
import Category from '../../controllers/category';
import {
  checkCategoryExist,
  checkCategoryNotExist,
  updateCategoryMiddleware
} from '../../middlewares/categoryMiddleware';
import isAuthenticated from '../../middlewares/auth';

const router = express.Router();

router.post(
  '/create',
  isAuthenticated,
  checkCategoryExist,
  Category.createCategory
);

router.delete(
  '/delete/:categoryTitle',
  isAuthenticated,
  Category.deleteCategory
);

router.put(
  '/update/:title',
  isAuthenticated,
  checkCategoryNotExist,
  updateCategoryMiddleware,
  Category.editCategory
);

router.get('/getAll', Category.getAllCategory);

router.get('/getAllCategories', Category.getAllCategories);

router.get('/getOne/:categoryTitle', Category.getOneCategory);

export default router;
