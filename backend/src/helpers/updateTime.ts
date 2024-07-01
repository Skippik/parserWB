import SystemInfo from '../model/systemInfo';

export const updateTime = async (type: 'categories' | 'products') => {
  try {
    const currentTimestamp = new Date().getTime();

    switch (type) {
      case 'categories':
        await SystemInfo.updateOne(
          {},
          {categoriesUpdateDate: currentTimestamp},
        );
        break;
      case 'products':
        await SystemInfo.updateOne({}, {productsUpdateDate: currentTimestamp});
        break;
      default:
        break;
    }

    console.log('Дата успешно обновлена.');
  } catch (error) {
    console.error('Ошибка при обновлении даты:', error);
  }
};
