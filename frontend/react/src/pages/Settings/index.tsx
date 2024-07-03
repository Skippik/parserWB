import {url} from '@/api';
import {Button, Col, Row, Spin, notification} from 'antd';
import axios from 'axios';
import {useState} from 'react';
import {useTranslation} from 'react-i18next';

const Settings = () => {
  //
  const {t} = useTranslation();
  //
  const [loading, setLoading] = useState(false);
  //
  const [api, contextHolder] = notification.useNotification();
  //
  const updateCategories = async () => {
    setLoading(true);
    try {
      await axios.get(url('categories-save'));
      api.success({
        message: t('Categories update'),
        description: t('Update success'),
      });
    } catch (error) {
      console.error('Ошибка при получении данных:', error);
      api.error({
        message: t('Categories update'),
        description: t('Update Error'),
      });
    } finally {
      setLoading(false);
    }
  };

  //
  const saveProducts = async () => {
    setLoading(true);
    try {
      await axios.get(url('products-save'));
      api.success({
        message: t('Products update'),
        description: t('Update success'),
      });
    } catch (error) {
      console.error('Ошибка при получении данных:', error);
      api.error({
        message: t('Products update'),
        description: t('Update Error'),
      });
    } finally {
      setLoading(false);
    }
  };
  //
  return (
    <>
      {contextHolder}
      {loading && <Spin fullscreen size='large' />}
      <Row style={{width: '100%'}} gutter={[10, 10]}>
        <Col span={4}>
          <Button type='primary' onClick={updateCategories}>
            {t('Update categories')}
          </Button>
        </Col>
        <Col span={4}>
          <Button type='primary' onClick={saveProducts}>
            {t('Update Products')}
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default Settings;
