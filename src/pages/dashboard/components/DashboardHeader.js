import React from "react";
import { Typography, Button, Space, Badge } from "antd";
import {
  PlusOutlined,
  BellOutlined,
  SearchOutlined,
  FilterOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const DashboardHeader = () => {
  // Get user info from localStorage
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");

  // Get current time greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  // Get current date
  const getCurrentDate = () => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date().toLocaleDateString("en-US", options);
  };

  const userName =
    userInfo.name && userInfo.surname
      ? `${userInfo.name} ${userInfo.surname}`
      : userInfo.name || "User";

  return (
    <div
      style={{
        background: "#fff",
        padding: "32px 40px",
        borderBottom: "1px solid #f0f0f0",
        marginBottom: "32px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "24px",
        }}
      >
        {/* Left Section - Greeting */}
        <div>
          <Title
            level={1}
            style={{
              margin: 0,
              fontSize: "32px",
              fontWeight: "700",
              lineHeight: "40px",
              color: "#1a1a1a",
            }}
          >
            {getGreeting()}, {userName.split(" ")[0]}!
          </Title>
          <Text
            style={{
              fontSize: "16px",
              color: "#8c8c8c",
              display: "block",
              marginTop: "8px",
            }}
          >
            {getCurrentDate()} • Here's what's happening in your fleet today
          </Text>
        </div>

        {/* Right Section - Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Space size="middle">
            <Button
              icon={<SearchOutlined />}
              style={{
                borderRadius: "8px",
                height: "40px",
                minWidth: "40px",
              }}
            />

            <Button
              icon={<FilterOutlined />}
              style={{
                borderRadius: "8px",
                height: "40px",
                minWidth: "40px",
              }}
            />

            <Badge count={3} size="small">
              <Button
                icon={<BellOutlined />}
                style={{
                  borderRadius: "8px",
                  height: "40px",
                  minWidth: "40px",
                }}
              />
            </Badge>

            <Button
              type="primary"
              icon={<PlusOutlined />}
              style={{
                borderRadius: "8px",
                height: "40px",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                border: "none",
                fontWeight: "500",
                boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
              }}
            >
              Quick Add
            </Button>
          </Space>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div
        style={{
          marginTop: "24px",
          padding: "16px 0",
          display: "flex",
          gap: "32px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: "#52c41a",
            }}
          />
          <Text style={{ color: "#8c8c8c", fontSize: "14px" }}>
            All systems operational
          </Text>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: "#1890ff",
            }}
          />
          <Text style={{ color: "#8c8c8c", fontSize: "14px" }}>
            12 active routes
          </Text>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: "#faad14",
            }}
          />
          <Text style={{ color: "#8c8c8c", fontSize: "14px" }}>
            3 pending approvals
          </Text>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
