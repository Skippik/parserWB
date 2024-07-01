import {Router} from 'express';
import categoryController from '../controler/categoryController';
import updateDataWbController from '../controler/updateDataWbController';
import systemInfoController from '../controler/systemInfoController';

const router = Router();

router.get('/categories', categoryController.getAllCategories);
router.get('/category', categoryController.getCategory);
router.get('/categories-save', updateDataWbController.saveCategoriesBD);
router.get('/products-save', updateDataWbController.saveProductsBD);
router.get('/system-info', systemInfoController.getSystemInfo);

export default router;
