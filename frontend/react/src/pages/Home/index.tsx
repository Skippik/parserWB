import {selectCategories} from '@/features';
import {Card, Col, Row, Tag} from 'antd';
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';
import {Link} from 'react-router-dom';

const Home = () => {
  //
  const {data} = useSelector(selectCategories);
  //
  const {t} = useTranslation();

  return (
    <Row>
      <Col span={8}>
        <Card
          title={t('Categories')}
          extra={<Link to='/categories'>{t('Categories')}</Link>}
          style={{width: 300}}>
          <Tag>{`${t('Categories count')}: ${data?.length}`}</Tag>
        </Card>
      </Col>
    </Row>
  );
};

export default Home;
