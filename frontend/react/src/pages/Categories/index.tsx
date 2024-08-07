import {selectCategories} from '@/features';
import {Menu, MenuProps, Row} from 'antd';
import {Cat, PawPrint} from 'lucide-react';
import {useSelector} from 'react-redux';

//
type MenuItem = Required<MenuProps>['items'][number];

const Categories = () => {
  //
  const {data} = useSelector(selectCategories);

  const mainCategories = () => {
    const mainCategories: MenuItem[] = [];
    if (!data) {
      return;
    }

    data.forEach(cat => {
      if (cat.id !== 2337) {
        console.log(cat);
      }

      if (!cat.parentId) {
        const childrenCategories: MenuItem[] = data
          .filter(childCat => +childCat.parentId === cat.id)
          .map(childCat => ({
            key: childCat.id,
            label: childCat.name,
            icon: <PawPrint />,
          }));

        mainCategories.push({
          key: cat.id,
          label: `${cat.name}: ${childrenCategories.length} ${cat.id}`,
          icon: <Cat />,
          children: childrenCategories.length ? childrenCategories : undefined,
        });
      }
    });

    return mainCategories;
  };

  const onClick: MenuProps['onClick'] = e => {
    console.log('click ', e);
  };

  return (
    <Row>
      <Menu
        onClick={onClick}
        style={{width: 300}}
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        mode='inline'
        items={mainCategories()}
      />
    </Row>
  );
};

export default Categories;
