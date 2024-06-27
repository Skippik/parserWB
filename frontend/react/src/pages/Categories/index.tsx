import {selectCategories} from '@/features';
import {useSelector} from 'react-redux';

const Categories = () => {
  //
  const categories = useSelector(selectCategories);

  console.log('categories', categories);

  return <div>{'categories'}</div>;
};

export default Categories;
