import { Route, Routes } from 'react-router-dom';
import NoticeBox from './pages/NoticeBox';
import { getBaseUrl } from './utils';
import LinksBar from './pages/LinksBar';

const App = () => {
  getBaseUrl();

  return (
    <>
      <Routes>
        <Route path='/' element={<LinksBar />} />
        <Route path='send-message' element={<NoticeBox />} />
      </Routes>
    </>
  );
};

export default App;
