import axios, {AxiosError, AxiosResponse} from 'axios';
import Category, {CategoryType} from '../model/category';
import Product, {ProductType} from '../model/product';
import {Request, Response} from 'express';
import {updateTime} from '../helpers/updateTime';
import cliProgress from 'cli-progress';

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

// get products to category
const getProductsByCategory = async (cat: CategoryType) => {
  let currentPage = 1;
  let fetchedTotal = 0;
  const products: ProductType[] = [];

  const totalProducts = await getTotalProducts(cat);
  // Настройка прогресс-бара для продуктов
  const productProgressBar = new cliProgress.SingleBar({
    format:
      'Загрузка продуктов [{bar}] {percentage}% | {value}/{total} | {duration_formatted}',
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
    hideCursor: true,
  });

  productProgressBar.start(totalProducts, 0);

  while (fetchedTotal < totalProducts) {
    const url = `https://catalog.wb.ru/catalog/${cat.shard}/v2/catalog?cat=${cat.id}&limit=60&sort=popular&page=${currentPage}&appType=128&curr=byn&lang=ru&dest=-59208&spp=30`;

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
        // Обновляем прогресс-бар для продуктов
        productProgressBar.update(fetchedTotal);
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
            const startTime = Date.now();
            const countdownInterval = setInterval(() => {
              const elapsed = Math.round((Date.now() - startTime) / 1000);
              productProgressBar.update(fetchedTotal, {
                countdown: `${60 - elapsed}s`,
              });
            }, 1000);

            await delay(60000); // Задержка в 30 секунд

            clearInterval(countdownInterval);
            productProgressBar.update(fetchedTotal, {
              countdown: '',
            });
          }
        }
      } else {
        // Другие ошибки
        console.error('Ошибка:', error);
      }
    }
  }

  // Завершаем прогресс-бар для продуктов
  productProgressBar.stop();

  return products;
};

const getProductsCategories = async (): Promise<{
  total: number;
  products: ProductType[];
}> => {
  try {
    const categoriesData: CategoryType[] = await Category.find();
    const products: ProductType[] = [];
    // Настройка прогресс-бара
    progressBar.start(categoriesData.length, 0);

    for (let i = 0; i < 2; i++) {
      const cat = categoriesData[i];
      if (!cat.id || !cat.parentId) {
        continue;
      }

      const productByCat = await getProductsByCategory(cat);

      products.push(...productByCat);

      // Обновляем прогресс-бар для категорий
      progressBar.update(i + 1);
    }

    // Завершаем прогресс-бар для категорий
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

const saveProductsDB = async (): Promise<ProductType[]> => {
  try {
    const productData = await getProductsCategories();

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
    const products = await saveProductsDB();

    if (products.length > 0) {
      updateTime('products');
      res.status(200).json(products);
    } else {
      res.status(404).json({error: 'No products were saved'});
    }
  } catch (error) {
    console.error('Error updating products:', error);
    res.status(500).json({error: 'Failed to update products'});
  } finally {
  }
};

export default {updateProducts};
