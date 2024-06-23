import {Router} from 'express';
import categoryController from '../controler/categoryController';
import updateDataWbController from '../controler/updateDataWbController';

const router = Router();

router.get('/categories', categoryController.getAllCategories);
router.get('/category', categoryController.getCategory);
router.get('/categories-save', updateDataWbController.saveCategoriesBD);
router.get('/products-save', updateDataWbController.saveProductsBD);

export default router;
