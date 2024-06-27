import {Layout, Menu, Spin, theme} from 'antd';
import Sider from 'antd/es/layout/Sider';
import {useState} from 'react';
import MainHeader from '../MainHeader';
import {Content} from 'antd/es/layout/layout';
import menu from './MenuConfig';
import {useTranslation} from 'react-i18next';
import {Link, useLocation} from 'react-router-dom';
import AppRouter from '@/router';
import {useGetCategoriesQuery} from '@/api';

const MainLayout = () => {
  //
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: {colorBgContainer, borderRadiusLG},
  } = theme.useToken();
  //
  const {t} = useTranslation();
  //
  //
  const location = useLocation();
  //
  const activeRoute = '/' + location.pathname.split('/')[1] || '';
  //
  const {isLoading} = useGetCategoriesQuery();
  //
  return (
    <>
      {isLoading && <Spin fullscreen size='large' />}
      <Layout style={{minHeight: '100vh'}}>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={value => setCollapsed(value)}>
          <Menu
            selectedKeys={[activeRoute]}
            activeKey=''
            theme='dark'
            defaultSelectedKeys={['1']}
            mode='inline'
            items={menu.menuItemsConfig.map(item => ({
              ...item,
              label: <Link to={item.key}>{t(item.label)}</Link>,
            }))}
          />
        </Sider>
        <Layout>
          <MainHeader />
          <Content style={{margin: '0 16px'}}>
            <div
              style={{
                padding: 24,
                minHeight: '100%',
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
              }}>
              <AppRouter />
            </div>
          </Content>
          {/* <Footer style={{textAlign: 'center'}}>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer> */}
        </Layout>
      </Layout>
    </>
  );
};

export default MainLayout;
