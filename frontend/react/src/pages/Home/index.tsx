import {useGetCategoriesQuery} from '@/api';

const Home = () => {
  const {
    data: categories,
    isError,
    isFetching,
    refetch,
  } = useGetCategoriesQuery();

  console.log('home', categories);

  return <div>{'Home'}</div>;
};

export default Home;
