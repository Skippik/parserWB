import {Header} from 'antd/es/layout/layout';
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';

const MainHeader = () => {
  //
  const {t} = useTranslation();
  //
  // const systemInfo = useSelector(selectSystemInfo)
  //
  return (
    <Header style={{display: 'flex', alignItems: 'center'}}>
      <></>
    </Header>
  );
};

export default MainHeader;
