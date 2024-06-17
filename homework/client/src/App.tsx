import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { Link, BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes';
import SettingPage from './pages/SettingPage';
import {
  BarChartOutlined,
  TagsOutlined,
  AlignLeftOutlined
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

 
  


const App: React.FC = () => {
  
  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Header className="header" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div className="logo" style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>
            内容管理平台
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <SettingPage/>
            <span style={{ marginRight: 8, color: 'white' }}> 设置</span>
          </div>
        </Header>
        <Layout>
          <Sider
            width={200}
            className="site-layout-background"
            collapsible
            collapsed={collapsed} // 设置Sider的collapsed属性为collapsed状态
            onCollapse={toggleCollapsed} // 设置收起展开的回调函数
          >
            <Menu
              theme="dark"
              mode="inline"
              defaultSelectedKeys={['1']}
              style={{ height: '100%', borderRight: 0 }}
            >
              <Menu.Item key="1" icon={<AlignLeftOutlined />}>
                <Link to="/My">学习心得</Link>
              </Menu.Item>
              <Menu.Item key="2" icon={<BarChartOutlined />}>
                <Link to="/data">数据管理</Link>
              </Menu.Item>
              <Menu.Item key="3" icon={<TagsOutlined />}>
                <Link to="/tags">标签管理</Link>
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout style={{ padding: '0 24px 24px' }}>
            <Content
              style={{
                padding: 24,
                margin: 0,
                minHeight: 280,
                background: '#fff'
              }}
            >
              <AppRoutes />
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </Router>
  );
};

export default App;
