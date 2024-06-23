import {Request, Response} from 'express';
import Category, {CategoryType} from '../model/category';
import {handleError} from '../helpers/error';

const getAllCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories: CategoryType[] = await Category.find();
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({error: handleError(err)});
  }
};

const getCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const category: CategoryType | null = await Category.findById(
      req.params.id,
    );
    //
    if (category) {
      res.status(200).json(category);
    } else {
      res.status(404).json({error: 'Category not found'});
    }
    //
  } catch (err) {
    res.status(500).json({error: handleError(err)});
  }
};

export default {getAllCategories, getCategory};
