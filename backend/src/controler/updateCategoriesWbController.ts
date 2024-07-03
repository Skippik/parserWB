import axios from 'axios';
import {CategoriesWbType} from '../types';
import Category from '../model/category';
import {Request, Response} from 'express';
import {updateTime} from '../helpers/updateTime';

const getCategoriesWB = async (url: string) => {
  try {
    const resp = await axios.get(url);

    if (!resp.data) {
      return [];
    }

    // Предполагаем, что данные приходят в формате массива категорий
    const categories: CategoriesWbType[] = resp.data;

    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

const saveCategoriesBD = async (req: Request, res: Response): Promise<void> => {
  const categoriesUrl =
    'https://static-basket-01.wbbasket.ru/vol0/data/main-menu-by-ru-v2.json';

  try {
    // Получаем категории
    const categories = await getCategoriesWB(categoriesUrl);

    let savedCount = 0;
    let updateCount = 0;

    const saveCategory = async (
      category: CategoriesWbType,
      parentId?: number,
    ) => {
      // Сохраняем или обновляем категорию
      const existingCategory = await Category.findOne({id: category.id});
      if (existingCategory) {
        await Category.updateOne({id: category.id}, category);
        updateCount++;
      } else {
        const newCategory = new Category({
          ...category,
          parentId: parentId ? parentId.toString() : null,
        });
        await newCategory.save();
        savedCount++;
      }

      // Рекурсивно сохраняем подкатегории
      if (category.childs && category.childs.length > 0) {
        for (const subCategory of category.childs) {
          await saveCategory(subCategory, category.id);
        }
      }
    };

    if (categories) {
      for (const category of categories) {
        await saveCategory(category);
      }
      updateTime('categories');
      res.status(200).json({
        'Categories save': savedCount,
        'Categories update': updateCount,
      });
    } else {
      res.status(404).json({error: 'Category not found'});
    }
  } catch (error) {
    console.error('Error saving categories to file:', error);
  }
};

export default {saveCategoriesBD};
