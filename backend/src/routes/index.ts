import {Router} from 'express';
import categoryController from '../controler/categoryController';

const router = Router();

router.get('/categories', categoryController.getAllCategories);
router.get('/categories-save', categoryController.saveCategories);
router.get('/category', categoryController.getCategory);

export default router;
