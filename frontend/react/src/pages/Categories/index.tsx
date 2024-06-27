import {useGetCategoriesQuery} from '@/api';

const Categories = () => {
  //
  const {
    data: categories,
    isError,
    isFetching,
    refetch,
  } = useGetCategoriesQuery();

  console.log('categories', categories);

  return <div>{'categories'}</div>;
};

export default Categories;
