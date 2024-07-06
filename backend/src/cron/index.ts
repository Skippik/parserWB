import UpdateProductsWbController from '../controler/UpdateProductsWbController';
import cron from 'node-cron';

export const cronUpdateTask = () => {
  // Планирование задания каждый день в 3 часа ночи
  cron.schedule('0 3 * * *', async () => {
    console.log('Запуск задачи по обновлению продуктов');
    try {
      await UpdateProductsWbController.saveProductsDB();
      console.log('Обновление продуктов завершено успешно');
    } catch (error) {
      console.error('Ошибка при обновлении продуктов:', error);
    }
  });

  // Начинаем планирование
  console.log('Планировщик запущен');
};
