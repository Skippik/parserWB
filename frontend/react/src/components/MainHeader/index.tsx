import {Button, Col, Row} from 'antd';
import {Header} from 'antd/es/layout/layout';

const MainHeader = () => {
  //

  //
  return (
    <Header style={{display: 'flex', alignItems: 'center'}}>
      <div className='demo-logo' />
      <Row>
        <Col span={8}>
          <Button>{'Update categories'}</Button>
        </Col>
      </Row>
    </Header>
  );
};

export default MainHeader;
