import {BiCategory} from 'react-icons/bi';
import {TfiDashboard} from 'react-icons/tfi';

const menu = {
  menuItemsConfig: [
    {key: '/', label: 'Dashboard', icon: <BiCategory />},
    {key: '/categories', label: 'Categories', icon: <TfiDashboard />},
  ] as {
    key: '/' | '/categories';
    label: string;
    icon?: JSX.Element;
  }[],
};

export default menu;
