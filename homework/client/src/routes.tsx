// src/routes.tsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DataListPage from './pages/DataListPage';
import DataAddEditPage from './pages/DataAddEditPage';
import TagListPage from './pages/TagListPage';
import SettingPage from './pages/SettingPage';
import MyPage from './pages/MyPage';
//import MyPage from './pages/MyPage';

const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={<MyPage />} />
    <Route path="/data" element={<DataListPage />} />
    <Route path="/data/add" element={<DataAddEditPage />} />
    <Route path="/data/edit/:id" element={<DataAddEditPage />} />
    <Route path="/tags" element={<TagListPage />} />
    <Route path="/setting" element={<SettingPage />} />
    <Route path="/My" element={<MyPage />} />
  </Routes>
);

export default AppRoutes;
