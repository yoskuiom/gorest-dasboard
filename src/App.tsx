import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Theme, presetGpnDefault } from '@consta/uikit/Theme';
import { HomePage } from './pages/HomePage';
import { UserPage } from './pages/UserPage';
import { PostPage } from './pages/PostPage';
import './index.css';

export const App = () => {
  return (
    <Theme preset={presetGpnDefault}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/user/:id" element={<UserPage />} />
          <Route path="/post/:id" element={<PostPage />} />
        </Routes>
      </BrowserRouter>
    </Theme>
  );
};

export default App;
