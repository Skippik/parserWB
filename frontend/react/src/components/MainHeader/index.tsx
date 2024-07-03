import {asDate} from '@/helpers';
import {useGetSystemInfoQuery} from '@/store';
import {Header} from 'antd/es/layout/layout';
import {Tag} from 'antd/lib';
import {useTranslation} from 'react-i18next';

const MainHeader = () => {
  //
  const {t} = useTranslation();
  //

  const {data} = useGetSystemInfoQuery();

  //
  return (
    <Header style={{display: 'flex', alignItems: 'center'}}>
      {data?.categoriesUpdateDate && (
        <Tag>{`${t('Last update categories')}: ${asDate(
          data.categoriesUpdateDate,
        )}`}</Tag>
      )}
      {data?.productsUpdateDate && (
        <Tag>{`${t('Last update products')}: ${asDate(
          data.productsUpdateDate,
        )}`}</Tag>
      )}
    </Header>
  );
};

export default MainHeader;
