import SystemInfo from '../model/systemInfo';

export const updateTimeCategories = async () => {
  try {
    const currentTimestamp = new Date().getTime();

    await SystemInfo.updateOne({}, {categoriesUpdateDate: currentTimestamp});

    console.log('Дата обновления категорий успешно обновлена.');
  } catch (error) {
    console.error('Ошибка при обновлении даты категорий:', error);
  }
};
