import React, { useState } from "react";
import { Layout } from "antd";
import SideBar from "../../common/components/SideBar";

const { Content } = Layout;

const MainLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  const handleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <SideBar collapsed={collapsed} onCollapse={handleCollapse} />
      <Layout
        style={{
          marginLeft: collapsed ? 80 : 280,
          transition: "margin-left 0.2s ease",
          minHeight: "100vh",
        }}
      >
        <Content
          style={{
            padding: 0,
            minHeight: "100vh",
            background: "#f5f5f5",
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
