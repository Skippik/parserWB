import {url} from '@/api';
import {Button, Col, Row} from 'antd';
import axios from 'axios';
import {useState} from 'react';
import {useTranslation} from 'react-i18next';

const Settings = () => {
  //
  const {t} = useTranslation();
  //
  const [loading, setLoading] = useState(false);
  //
  const updateCategories = async () => {
    setLoading(true); // Установка флага загрузки
    try {
      const response = await axios.get(url('categories-save')); // Выполнение GET запроса
      console.log(response.data); // Вывод данных в консоль
    } catch (error) {
      console.error('Ошибка при получении данных:', error);
    } finally {
      setLoading(false); // Снятие флага загрузки независимо от результата запроса
    }
  };
  const saveProducts = async () => {
    setLoading(true); // Установка флага загрузки
    try {
      const response = await axios.get(url('products-save')); // Выполнение GET запроса
      console.log(response.data); // Вывод данных в консоль
    } catch (error) {
      console.error('Ошибка при получении данных:', error);
    } finally {
      setLoading(false); // Снятие флага загрузки независимо от результата запроса
    }
  };
  //
  return (
    <Row style={{width: '100%'}} gutter={[10, 10]}>
      <Col span={4}>
        <Button type='primary' onClick={updateCategories} loading={loading}>
          {t('Update categories')}
        </Button>
      </Col>
      <Col span={4}>
        <Button type='primary' onClick={saveProducts} loading={loading}>
          {t('Update Products')}
        </Button>
      </Col>
    </Row>
  );
};

export default Settings;
