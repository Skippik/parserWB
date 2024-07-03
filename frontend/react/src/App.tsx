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
