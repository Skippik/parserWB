import axios, {AxiosError, AxiosResponse} from 'axios';
import Category, {CategoryType} from '../model/category';
import Product, {ProductType} from '../model/product';
import {Request, Response} from 'express';
import cliProgress from 'cli-progress';
import {updateTime} from '../helpers/updateTime';
import countdownTimer from '../helpers/countDownTimer';

// Создаем новый экземпляр прогресс-бара для категорий
const progressBar = new cliProgress.SingleBar({
  format: 'Progress |{bar}| {percentage}% | {value}/{total} Categories',
  barCompleteChar: '\u2588',
  barIncompleteChar: '\u2591',
  hideCursor: true,
});

// Функция для задержки выполнения в миллисекундах
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Функция для получения общего числа продуктов в категории
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

// Функция для получения продуктов по категории
const getProductsByCategory = async (cat: CategoryType) => {
  let currentPage = 1;
  let fetchedTotal = 0;
  const products: ProductType[] = [];

  // Получаем общее количество продуктов в категории
  const totalProducts = await getTotalProducts(cat);

  // Настройка прогресс-бара для продуктов
  const productProgressBar = new cliProgress.SingleBar({
    format:
      'Loading products [{bar}] {percentage}% | {value}/{total} | {duration_formatted}',
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
    hideCursor: true,
  });

  productProgressBar.start(totalProducts, 0);

  while (fetchedTotal < totalProducts) {
    const url = `https://catalog.wb.ru/catalog/${cat.shard}/v2/catalog?cat=${cat.id}&limit=100&sort=popular&page=${currentPage}&appType=128&curr=byn&lang=ru&dest=-59208&spp=30`;

    try {
      const resp: AxiosResponse<{
        data: {products: ProductType[]; total: number};
      }> = await axios.get(url, {
        headers: {
          // Заголовки для CORS-запроса
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Allow-Headers': 'Authorization',
          'Access-Control-Allow-Methods': 'HEAD,GET,OPTIONS',
          'Access-Control-Allow-Origin': 'https://www.wildberries.by',
          Connection: 'keep-alive',
          'Content-Encoding': 'gzip',
          'Content-Type': 'application/json; charset=utf-8',
          Host: 'catalog.wb.ru',
          Origin: 'https://www.wildberries.by',
          Referer: 'https://www.wildberries.by/',
          'Sec-Ch-Ua':
            '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
          'Sec-Ch-Ua-Mobile': '?0',
          'Sec-Ch-Ua-Platform': '"Windows"',
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'cross-site',
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
        },
      });

      if (!resp.data) {
        continue; // Продолжаем цикл, если данные пусты
      }

      const {products: fetchedProducts, total: pageTotal} = resp.data.data;

      if (pageTotal > 0) {
        // Добавляем категорию ID к каждому продукту
        const productsWithCategoryId = fetchedProducts.map(item => ({
          ...item,
          category_id: +cat.id,
        })) as ProductType[];
        products.push(...productsWithCategoryId);
        fetchedTotal += fetchedProducts.length;
        currentPage++;
        // Обновляем прогресс-бар для продуктов
        productProgressBar.update(fetchedTotal);

        // Сохраняем продукты после каждой 2000
        if (fetchedTotal % 1000 === 0) {
          await saveProductsToDB(products);
          products.length = 0; // Очищаем массив после сохранения
          console.log('Задержка на 3 минуты...');
          await delay(180000); // Задержка в 3 минуты
        }
      } else {
        break; // Выходим из цикла, если больше нет продуктов на текущей странице
      }

      // Добавляем задержку перед следующим запросом
      await delay(1000); // Задержка в 10 секунд
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
            // Ожидаем 5 минут перед повторной попыткой с обратным отсчётом
            const startTime = new Date();
            await countdownTimer(300);
            const endTime = new Date();
            console.log(
              `Повторная попытка. Прошло ${
                (endTime.getTime() - startTime.getTime()) / 1000
              } секунд.`,
            );
            console.log('Повторная попытка...');
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

  // Сохраняем оставшиеся продукты
  if (products.length > 0) {
    await saveProductsToDB(products);
  }

  return products;
};

// Функция для сохранения продуктов в базу данных
const saveProductsToDB = async (products: ProductType[]): Promise<void> => {
  try {
    await Promise.all(
      products.map(async product => {
        try {
          const newProduct = new Product(product);
          await newProduct.save();
        } catch (error) {
          console.error('Error saving product:', error);
          throw error;
        }
      }),
    );
  } catch (error) {
    console.error('Error saving products to database:', error);
    throw new Error('Failed to save products to database');
  }
};

// Функция для получения продуктов по всем категориям
const getProductsCategories = async (): Promise<{
  total: number;
  products: ProductType[];
}> => {
  try {
    const categoriesData: CategoryType[] = await Category.find();
    const products: ProductType[] = [];
    // Настройка прогресс-бара для категорий
    progressBar.start(categoriesData.length, 0);

    for (let i = 0; i < categoriesData.length; i++) {
      const cat = categoriesData[i];
      if (!cat.id || !cat.parentId) {
        continue; // Пропускаем категорию, если отсутствует id или parentId
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

// Функция для сохранения продуктов в базу данных и возвращения сохраненных продуктов
const saveProductsDB = async (): Promise<ProductType[]> => {
  try {
    const productData = await getProductsCategories();

    if (
      !productData ||
      !productData.products ||
      productData.products.length === 0
    ) {
      return []; // Возвращаем пустой массив, если нет продуктов для сохранения
    }

    // Сохраняем каждый продукт в базу данных параллельно
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

// Функция для обновления продуктов
export const updateProducts = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const products = await saveProductsDB();

    if (products.length > 0) {
      updateTime('products'); // Обновляем время последнего обновления продуктов
      res.status(200).json(products);
    } else {
      res.status(404).json({error: 'No products were saved'});
    }
  } catch (error) {
    console.error('Error updating products:', error);
    res.status(500).json({error: 'Failed to update products'});
  }
};

// Экспортируем контроллер обновления продуктов
export default {updateProducts, saveProductsDB};
