import axios, {AxiosError, AxiosResponse} from 'axios';
import Category, {CategoryType} from '../model/category';
import Product, {ProductType} from '../model/product';
import {Request, Response} from 'express';
import cliProgress from 'cli-progress';
import {updateTime} from '../helpers/updateTime';

// Создаем новый экземпляр прогресс-бара
const progressBar = new cliProgress.SingleBar({
  format: 'Progress |{bar}| {percentage}% | {value}/{total} Categories',
  barCompleteChar: '\u2588',
  barIncompleteChar: '\u2591',
  hideCursor: true,
});

// delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// get total
const getTotalProducts = async (cat: CategoryType): Promise<number> => {
  try {
    const response = await axios.get(
      `https://catalog.wb.ru/catalog/${cat.shard}/v2/catalog?cat=${cat.id}&limit=0&sort=popular&page=1&appType=128&curr=byn&lang=ru&dest=-59208&spp=30`,
    );

    return response.data.data.total || 0;
  } catch (error) {
    console.error(
      `Error getting total products for category ${cat.id}:`,
      error,
    );
    return 0;
  }
};

// get products by category with pagination
const getProductsByCategory = async (
  cat: CategoryType,
  limit: number,
  offset: number,
): Promise<ProductType[]> => {
  let currentPage = 1;
  let fetchedTotal = 0;
  const products: ProductType[] = [];

  const totalProducts = await getTotalProducts(cat);

  while (fetchedTotal < totalProducts) {
    const url = `https://catalog.wb.ru/catalog/${cat.shard}/v2/catalog?cat=${cat.id}&limit=${limit}&sort=popular&page=${currentPage}&appType=128&curr=byn&lang=ru&dest=-59208&spp=30`;

    try {
      const resp: AxiosResponse<{
        data: {products: ProductType[]; total: number};
      }> = await axios.get(url);

      if (!resp.data) {
        continue; // Продолжаем цикл, если данные пусты
      }

      const {products: fetchedProducts, total: pageTotal} = resp.data.data;

      if (pageTotal > 0) {
        products.push(...fetchedProducts);
        fetchedTotal += fetchedProducts.length;
        currentPage++;
      } else {
        break; // Выходим из цикла, если больше нет продуктов на текущей странице
      }

      // Добавляем задержку перед следующим запросом
      await delay(1000); // Задержка в 1 секунду (1000 миллисекунд)
    } catch (error) {
      // Обработка ошибок Axios
      if (axios.isAxiosError(error)) {
        // Ошибка Axios
        const axiosError = error as AxiosError;
        console.error('Ошибка Axios:', axiosError.message);
        if (axiosError.response) {
          // Ответ с ошибкой от сервера
          console.error('Ответ сервера:', axiosError.response.data);
          console.error('Статус ответа сервера:', axiosError.response.status);
          console.error(
            'Заголовки ответа сервера:',
            axiosError.response.headers,
          );

          // Проверяем статус 429 (слишком много запросов)
          if (axiosError.response.status === 429) {
            // Ожидаем 30 секунд перед повторной попыткой с обратным отсчётом
            await delay(30000); // Задержка в 30 секунд
          }
        }
      } else {
        // Другие ошибки
        console.error('Ошибка:', error);
      }
    }
  }

  return products;
};

const getProductsCategories = async (
  limitPerCategory: number,
): Promise<{
  total: number;
  products: ProductType[];
}> => {
  try {
    const categoriesData: CategoryType[] = await Category.find();
    const products: ProductType[] = [];

    progressBar.start(categoriesData.length, 0);

    for (let offset = 0; offset < limitPerCategory; offset += 1000) {
      for (const cat of categoriesData) {
        if (!cat.id || !cat.parentId) {
          continue;
        }

        const productByCat = await getProductsByCategory(cat, 1000, offset);

        products.push(...productByCat);

        progressBar.increment();
      }
    }

    progressBar.stop();

    return {
      total: products.length,
      products: products,
    };
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw new Error('Failed to fetch categories');
  }
};

const saveProductsDB = async (
  limitPerCategory: number,
): Promise<ProductType[]> => {
  try {
    const productData = await getProductsCategories(limitPerCategory);

    if (
      !productData ||
      !productData.products ||
      productData.products.length === 0
    ) {
      return [];
    }

    const savedProducts = await Promise.all(
      productData.products.map(async (product: ProductType) => {
        try {
          const newProduct = new Product(product);
          const savedProduct = await newProduct.save();
          return savedProduct;
        } catch (error) {
          console.error('Error saving product:', error);
          throw error;
        }
      }),
    );

    return savedProducts;
  } catch (error) {
    console.error('Error saving products to database:', error);
    throw new Error('Failed to save products to database');
  }
};

export const updateProducts = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const limitPerCategory = 1000;
    const products = await saveProductsDB(limitPerCategory);

    if (products.length > 0) {
      updateTime('products');
      res.status(200).json(products);
    } else {
      res.status(404).json({error: 'No products were saved'});
    }
  } catch (error) {
    console.error('Error updating products:', error);
    res.status(500).json({error: 'Failed to update products'});
  }
};

export default {updateProducts};
