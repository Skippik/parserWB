import axios, {AxiosResponse} from 'axios';
import {CategoriesWbType} from '../types';
import Category, {CategoryType} from '../model/category';
import {Request, Response} from 'express';
import Product, {ProductType} from '../model/product';
import SystemInfo from '../model/systemInfo';
import {updateTimeCategories} from '../helpers/updateTime';

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

const getProductsCategories = async (): Promise<{
  total: number;
  products: ProductType[];
}> => {
  try {
    const categoriesData: CategoryType[] = await Category.find();

    const products: ProductType[] = [];
    let total = 0;

    for (let i = 0; i < 3; i++) {
      const cat = categoriesData[i];
      if (!cat.id) {
        continue;
      }
      if (cat.shard && cat.id) {
        const url = `https://catalog.wb.ru/catalog/${cat.shard}/v2/catalog?appType=1&cat=${cat.id}&curr=rub&spp=30&dest=-68619`;

        const resp: AxiosResponse<{
          data: {products: ProductType[]; total: number};
        }> = await axios.get(url);

        if (!resp.data) {
          continue; // Пропускаем итерацию, если данные пусты
        }

        const {products: fetchedProducts, total: fetchedTotal} = resp.data.data;

        if (fetchedTotal) {
          total = fetchedTotal;
          products.push(...fetchedProducts); // Добавляем полученные продукты в массив
        }
      }
    }

    return {
      total: total,
      products: products,
    };
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw new Error('Failed to fetch categories');
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
      res.status(200).json({
        'Categories save': savedCount,
        'Categories update': updateCount,
      });
      updateTimeCategories();
    } else {
      res.status(404).json({error: 'Category not found'});
    }
  } catch (error) {
    console.error('Error saving categories to file:', error);
  }
};

const saveProductsBD = async (req: Request, res: Response): Promise<void> => {
  try {
    const productData = await getProductsCategories();

    if (
      !productData ||
      !productData.products ||
      productData.products.length === 0
    ) {
      res
        .status(404)
        .json({error: 'No products found or invalid data structure'});
    }

    const savedProducts = await Promise.all(
      productData.products.map(async (product: ProductType) => {
        try {
          // Создаем новый экземпляр Product и сохраняем его
          const newProduct = new Product(product);
          const savedProduct = await newProduct.save();

          return savedProduct;
        } catch (error) {
          console.error('Error saving product:', error);
          throw error;
        }
      }),
    );

    // Проверяем, были ли успешно сохранены какие-либо продукты
    if (savedProducts.length > 0) {
      res.status(200).json(savedProducts); // Возвращаем массив сохраненных продуктов
    } else {
      res.status(404).json({error: 'No products were saved'});
    }
  } catch (error) {
    console.error('Error saving products to database:', error);
    res.status(500).json({error: 'Failed to save products to database'});
  }
};

export default {saveCategoriesBD, saveProductsBD};
