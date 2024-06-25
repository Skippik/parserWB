import {ConfigProvider} from 'antd';
import {useTranslation} from 'react-i18next';
import './assets/less/index.less';
import {BrowserRouter} from 'react-router-dom';
import ru from 'antd/locale/ru_RU';
import {ErrorBoundaries, MainLayout} from './components';

const App = () => {
  //
  const {t} = useTranslation();
  //
  //
  // //
  // const getCategories = async () => {
  //   setLoading(true); // Установка флага загрузки
  //   try {
  //     const response = await axios.get(url('categories')); // Выполнение GET запроса
  //     console.log(response.data); // Вывод данных в консоль
  //   } catch (error) {
  //     console.error('Ошибка при получении данных:', error);
  //   } finally {
  //     setLoading(false); // Снятие флага загрузки независимо от результата запроса
  //   }
  // };
  // //
  // const updateCategories = async () => {
  //   setLoading(true); // Установка флага загрузки
  //   try {
  //     const response = await axios.get(url('categories-save')); // Выполнение GET запроса
  //     console.log(response.data); // Вывод данных в консоль
  //   } catch (error) {
  //     console.error('Ошибка при получении данных:', error);
  //   } finally {
  //     setLoading(false); // Снятие флага загрузки независимо от результата запроса
  //   }
  // };
  // const saveProducts = async () => {
  //   setLoading(true); // Установка флага загрузки
  //   try {
  //     const response = await axios.get(url('products-save')); // Выполнение GET запроса
  //     console.log(response.data); // Вывод данных в консоль
  //   } catch (error) {
  //     console.error('Ошибка при получении данных:', error);
  //   } finally {
  //     setLoading(false); // Снятие флага загрузки независимо от результата запроса
  //   }
  // };
  //
  return (
    <BrowserRouter>
      <ConfigProvider
        locale={ru}
        direction={'ltr'}
        form={{
          colon: false,
        }}
        input={{}}>
        <ErrorBoundaries
          btnTitle={t('Go home')}
          errorTitle={t('Sorry, something went wrong.')}>
          <MainLayout />
        </ErrorBoundaries>
      </ConfigProvider>
    </BrowserRouter>
  );
};

export default App;
