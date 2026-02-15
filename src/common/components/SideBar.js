import React from "react";
import { Layout, Menu, Typography, Avatar, Button } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  DashboardOutlined,
  UserOutlined,
  CarOutlined,
  CalendarOutlined,
  FileTextOutlined,
  SettingOutlined,
  LogoutOutlined,
  BellOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";

const { Sider } = Layout;
const { Text } = Typography;

const SideBar = ({ collapsed, onCollapse }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get user info from localStorage
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");

  const menuItems = [
    {
      key: "/",
      icon: <DashboardOutlined />,
      label: "Dashboard",
    },
    {
      key: "/vehicles",
      icon: <CarOutlined />,
      label: "Vehicles",
    },
    {
      key: "/drivers",
      icon: <UserOutlined />,
      label: "Drivers",
    },
    {
      key: "/bookings",
      icon: <CalendarOutlined />,
      label: "Bookings",
    },
    {
      key: "/invoices",
      icon: <FileTextOutlined />,
      label: "Invoices",
    },
    {
      key: "/community",
      icon: <TeamOutlined />,
      label: "Community",
    },
    {
      key: "divider1",
      type: "divider",
    },
    {
      key: "/notifications",
      icon: <BellOutlined />,
      label: "Notifications",
    },
    {
      key: "/settings",
      icon: <SettingOutlined />,
      label: "Settings",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
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
        background: "#fff",
        borderRight: "1px solid #f0f0f0",
        boxShadow: "2px 0 8px rgba(0,0,0,0.06)",
      }}
    >
      {/* Logo and Brand */}
      <div
        style={{
          padding: collapsed ? "16px 12px" : "20px 24px",
          borderBottom: "1px solid #f0f0f0",
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
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: "bold",
              fontSize: "14px",
              minWidth: "40px",
            }}
          >
            AK
          </div>
          {!collapsed && (
            <div>
              <Text strong style={{ fontSize: "16px", color: "#1a1a1a" }}>
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
          }}
        />
      </div>

      {/* User Profile Section */}
      {!collapsed && (
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid #f0f0f0",
            background: "#fafafa",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Avatar
              size={48}
              style={{
                backgroundColor: "#667eea",
                color: "white",
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
                }}
              >
                {userInfo.name && userInfo.surname
                  ? `${userInfo.name} ${userInfo.surname}`
                  : "User"}
              </Text>
              <Text
                style={{
                  color: "#8c8c8c",
                  fontSize: "12px",
                  display: "block",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {userInfo.email || "user@example.com"}
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
        }}
        theme="light"
      />
    </Sider>
  );
};

export default SideBar;
