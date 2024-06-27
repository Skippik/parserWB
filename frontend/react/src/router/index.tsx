import {Result} from 'antd';
import {Suspense, lazy} from 'react';
import {Route, Routes} from 'react-router-dom';

const Home = lazy(() => import('../pages/Home'));

const AppRouter = () => {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='*' element={<Result status='404' title='404' />} />;
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
