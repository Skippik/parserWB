import {Request, Response} from 'express';
import Category, {CategoryType} from '../model/category';
import {handleError} from '../helpers/error';
import axios from 'axios';
import fs from 'fs';
import {Categories} from '../types';
const path = require('path');

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

const getCategoriesWB = async (url: string) => {
  try {
    const resp = await axios.get(url);

    if (!resp.data) {
      return [];
    }

    // Предполагаем, что данные приходят в формате массива категорий
    const categories: Categories[] = resp.data;

    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

const saveCategories = async () => {
  const categoriesUrl =
    'https://static-basket-01.wbbasket.ru/vol0/data/main-menu-by-ru-v2.json';
  const fileName = 'categories.json';
  const folderName = 'jsonData'; // Имя папки, которую хотите создать

  try {
    // Получаем категории
    const categories = await getCategoriesWB(categoriesUrl);

    // Путь к папке, где будет храниться файл
    const folderPath = path.join(__dirname, '..', folderName);

    // Проверяем существует ли папка, и если нет - создаем её
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }

    // Путь к файлу
    const filePath = path.join(folderPath, fileName);

    // Сохраняем категории в файл
    const jsonContent = JSON.stringify(categories, null, 2);
    fs.writeFileSync(filePath, jsonContent);

    console.log(`Categories have been saved to ${filePath}`);
  } catch (error) {
    console.error('Error saving categories to file:', error);
  }
};

export default {getAllCategories, getCategory, saveCategories};
