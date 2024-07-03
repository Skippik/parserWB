import {Router} from 'express';
import categoryController from '../controler/categoryController';
import systemInfoController from '../controler/systemInfoController';
import updateCategoriesWbController from '../controler/updateCategoriesWbController';
import UpdateProductsWbController from '../controler/UpdateProductsWbController';

const router = Router();

router.get('/categories', categoryController.getAllCategories);
router.get('/category', categoryController.getCategory);
router.get('/categories-save', updateCategoriesWbController.saveCategoriesBD);
router.get('/products-save', UpdateProductsWbController.updateProducts);
router.get('/system-info', systemInfoController.getSystemInfo);

export default router;
