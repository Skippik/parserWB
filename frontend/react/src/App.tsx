import {Button, Col, Layout, Row, theme} from 'antd';
import {Content, Footer, Header} from 'antd/es/layout/layout';
import axios from 'axios';
import {useTranslation} from 'react-i18next';
import {url} from './api';
import {useState} from 'react';

const App = () => {
  //
  const {t} = useTranslation();
  //
  const {
    token: {colorBgContainer, borderRadiusLG},
  } = theme.useToken();
  //
  const [loading, setLoading] = useState(false);
  //
  const getCategories = async () => {
    setLoading(true); // Установка флага загрузки
    try {
      const response = await axios.get(url('categories')); // Выполнение GET запроса
      console.log(response.data); // Вывод данных в консоль
    } catch (error) {
      console.error('Ошибка при получении данных:', error);
    } finally {
      setLoading(false); // Снятие флага загрузки независимо от результата запроса
    }
  };
  //
  return (
    <Layout>
      <Header style={{display: 'flex', alignItems: 'center'}}>
        <div className='demo-logo' />
        <></>
      </Header>
      <Content style={{padding: '0 48px'}}>
        <div
          style={{
            background: colorBgContainer,
            minHeight: 280,
            padding: 24,
            borderRadius: borderRadiusLG,
          }}>
          <Row gutter={[10, 10]}>
            <Col span={24}>
              <Button loading={loading} type='primary' onClick={getCategories}>
                {t('Categories')}
              </Button>
            </Col>
          </Row>
        </div>
      </Content>
      <Footer style={{textAlign: 'center'}}>
        Ant Design ©{new Date().getFullYear()} Created by Ant UED
      </Footer>
    </Layout>
  );
};

export default App;
