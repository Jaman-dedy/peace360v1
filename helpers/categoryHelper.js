import Category from '../models/Category';
const updateCategoryHelper = async req => {
  try {
    const { categoryTitle, description } = req.body;
    const findCategory = await Category.findOne({
      categoryTitle: req.params.categoryTitle
    });

    const updateCategory = await Category.findOneAndUpdate(
      { categoryTitle: req.params.categoryTitle },
      {
        categoryTitle: categoryTitle
          ? categoryTitle
          : findCategory.categoryTitle,
        description: description ? description : findCategory.description
      }
    );

    return updateCategory;
  } catch (error) {
    return { error };
  }
};

export { updateCategoryHelper };
