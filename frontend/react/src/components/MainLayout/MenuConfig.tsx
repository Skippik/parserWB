import {BiCategory} from 'react-icons/bi';
import {CiSettings} from 'react-icons/ci';
import {TfiDashboard} from 'react-icons/tfi';

const menu = {
  menuItemsConfig: [
    {key: '/', label: 'Dashboard', icon: <BiCategory />},
    {key: '/categories', label: 'Categories', icon: <TfiDashboard />},
    {key: '/settings', label: 'Settings', icon: <CiSettings />},
  ] as {
    key: '/' | '/categories';
    label: string;
    icon?: JSX.Element;
  }[],
};

export default menu;
