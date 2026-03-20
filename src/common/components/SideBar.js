import React from "react";
import { Layout, Menu, Typography, Avatar, Button } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  DashboardOutlined,
  UserOutlined,
  CarOutlined,
  FileTextOutlined,
  LogoutOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";

const { Sider } = Layout;
const { Text } = Typography;

const SideBar = ({ collapsed, onCollapse }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");

  const menuItems = [
    {
      key: "/",
      icon: <DashboardOutlined />,
      label: "Panel",
    },
    {
      key: "/vehicles",
      icon: <CarOutlined />,
      label: "Araçlar",
    },
    {
      key: "/drivers",
      icon: <UserOutlined />,
      label: "Sürücüler",
    },
    {
      key: "/invoices",
      icon: <FileTextOutlined />,
      label: "Faturalar",
    },
    {
      key: "/loads",
      icon: <TeamOutlined />,
      label: "Yükler",
    },
    {
      key: "divider1",
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Çıkış Yap",
      danger: true,
    },
  ];

  const handleMenuClick = (e) => {
    if (e.key === "logout") {
      localStorage.clear();
      navigate("/login");
      return;
    }
    navigate(e.key);
  };

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={280}
      collapsedWidth={80}
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        height: "100vh",
        zIndex: 1000,
        background: "#111111",
        borderRight: "none",
        boxShadow: "2px 0 12px rgba(0,0,0,0.15)",
      }}
    >
      {/* Logo and Brand */}
      <div
        style={{
          padding: collapsed ? "16px 12px" : "20px 24px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          minHeight: "72px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: 40,
              height: 40,
              background: "#ffffff",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#111111",
              fontWeight: "bold",
              fontSize: "14px",
              minWidth: "40px",
            }}
          >
            AK
          </div>
          {!collapsed && (
            <div>
              <Text strong style={{ fontSize: "16px", color: "#ffffff" }}>
                AKNA Transport
              </Text>
            </div>
          )}
        </div>
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={onCollapse}
          style={{
            fontSize: "16px",
            width: 32,
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "rgba(255,255,255,0.6)",
          }}
        />
      </div>

      {/* User Profile Section */}
      {!collapsed && (
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(255,255,255,0.04)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Avatar
              size={48}
              style={{
                backgroundColor: "#ffffff",
                color: "#111111",
                fontWeight: "bold",
                fontSize: "16px",
              }}
            >
              {userInfo.name ? userInfo.name.charAt(0).toUpperCase() : "U"}
            </Avatar>
            <div style={{ flex: 1, minWidth: 0 }}>
              <Text
                strong
                style={{
                  display: "block",
                  fontSize: "14px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  color: "#ffffff",
                }}
              >
                {userInfo.name && userInfo.surname
                  ? `${userInfo.name} ${userInfo.surname}`
                  : "Kullanıcı"}
              </Text>
              <Text
                style={{
                  color: "rgba(255,255,255,0.45)",
                  fontSize: "12px",
                  display: "block",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {userInfo.email || "kullanici@example.com"}
              </Text>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={handleMenuClick}
        style={{
          border: "none",
          fontSize: "14px",
          padding: "16px 0",
          background: "transparent",
        }}
        theme="dark"
      />
    </Sider>
  );
};

export default SideBar;
