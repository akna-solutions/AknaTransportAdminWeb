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
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Günaydın";
    if (hour < 17) return "İyi günler";
    return "İyi akşamlar";
  };

  const getCurrentDate = () => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date().toLocaleDateString("tr-TR", options);
  };

  const userName =
    userInfo.name && userInfo.surname
      ? `${userInfo.name} ${userInfo.surname}`
      : userInfo.name || "Kullanıcı";

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
            {getCurrentDate()} • Filonuzda bugün neler oluyor
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
            <a href="/create-load">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                style={{
                  borderRadius: "8px",
                  height: "40px",
                  background: "#111111",
                  border: "none",
                  fontWeight: "500",
                }}
              >
                Hızlı Ekle
              </Button>
            </a>
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
              backgroundColor: "#333333",
            }}
          />
          <Text style={{ color: "#8c8c8c", fontSize: "14px" }}>
            Tüm sistemler çalışıyor
          </Text>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: "#666666",
            }}
          />
          <Text style={{ color: "#8c8c8c", fontSize: "14px" }}>
            12 aktif rota
          </Text>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: "#999999",
            }}
          />
          <Text style={{ color: "#8c8c8c", fontSize: "14px" }}>
            3 bekleyen onay
          </Text>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
