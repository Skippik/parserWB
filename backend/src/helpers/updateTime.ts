import SystemInfo, {SystemInfoType} from '../model/systemInfo';

export const updateTime = async (type: 'categories' | 'products') => {
  try {
    const currentTimestamp = new Date().getTime();

    // Проверяем наличие записей
    const existingSystemInfo = await SystemInfo.findOne({});

    if (!existingSystemInfo) {
      // Если записей нет, создаем новый документ
      const newSystemInfo = new SystemInfo({
        categoriesUpdateDate:
          type === 'categories' ? currentTimestamp : undefined,
        productsUpdateDate: type === 'products' ? currentTimestamp : undefined,
      });

      await newSystemInfo.save();
      console.log('Новая запись успешно создана.');
    } else {
      // Если записи уже существуют, обновляем существующий документ
      let updateObject: Partial<SystemInfoType> = {};

      switch (type) {
        case 'categories':
          updateObject = {categoriesUpdateDate: currentTimestamp};
          break;
        case 'products':
          updateObject = {productsUpdateDate: currentTimestamp};
          break;
        default:
          break;
      }

      const result = await SystemInfo.updateOne({}, updateObject);
      console.log('Результат обновления:', result);

      if (result.modifiedCount === 1) {
        console.log('Дата успешно обновлена.');
      } else {
        console.log('Ничего не обновлено.');
      }
    }
  } catch (error) {
    console.error('Ошибка при обновлении даты:', error);
  }
};
