import React from "react";
import { Card, Timeline, Tag, Avatar, Typography } from "antd";
import {
  CarOutlined,
  UserOutlined,
  CalendarOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import tr from "../../../common/translations";
import { darkTheme } from "../../../common/darkTheme";

const { Text } = Typography;

const RecentActivities = () => {
  // Mock data for recent activities
  const activities = [
    {
      id: 1,
      type: "vehicle",
      action: tr.vehicleAdded,
      description: "Yeni kamyon BMW X7 (34-ABC-123) filo eklenmiştir",
      user: "Admin Kullanıcısı",
      timestamp: "2 saat önce",
      status: "success",
      icon: <CarOutlined />,
    },
    {
      id: 2,
      type: "user",
      action: tr.driverRegistered,
      description: "John Doe kaydı tamamlamış ve doğrulanmıştır",
      user: "John Doe",
      timestamp: "4 saat önce",
      status: "success",
      icon: <UserOutlined />,
    },
    {
      id: 3,
      type: "booking",
      action: tr.bookingConfirmed,
      description: "İstanbul - Ankara teslimatı yarın için planlanmıştır",
      user: "Taşıma Müdürü",
      timestamp: "6 saat önce",
      status: "processing",
      icon: <CalendarOutlined />,
    },
    {
      id: 4,
      type: "maintenance",
      action: tr.maintenanceRequired,
      description: "Araç 06-XYZ-789 periyodik bakıma ihtiyaç duyuyor",
      user: "Sistem",
      timestamp: "8 saat önce",
      status: "warning",
      icon: <ExclamationCircleOutlined />,
    },
    {
      id: 5,
      type: "invoice",
      action: tr.invoiceGenerated,
      description: "Fatura #INV-2024-001 tamamlanmış teslimat için oluşturuldu",
      user: "Finans Ekibi",
      timestamp: "12 saat önce",
      status: "success",
      icon: <FileTextOutlined />,
    },
    {
      id: 6,
      type: "user",
      action: tr.driverUpdated,
      description: "Sarah Wilson profil bilgilerini güncelleştirdi",
      user: "Sarah Wilson",
      timestamp: "1 gün önce",
      status: "default",
      icon: <UserOutlined />,
    },
  ];

  const getStatusColor = (status) => {
    const colors = {
      success: "#52c41a",
      processing: "#1890ff",
      warning: "#faad14",
      error: "#ff4d4f",
      default: "#8c8c8c",
    };
    return colors[status] || colors.default;
  };

  const getStatusIcon = (status) => {
    const icons = {
      success: <CheckCircleOutlined />,
      processing: <ClockCircleOutlined />,
      warning: <ExclamationCircleOutlined />,
      error: <ExclamationCircleOutlined />,
      default: <ClockCircleOutlined />,
    };
    return icons[status] || icons.default;
  };

  const timelineItems = activities.map((activity) => ({
    dot: (
      <div
        style={{
          width: "32px",
          height: "32px",
          borderRadius: "50%",
          backgroundColor: `${getStatusColor(activity.status)}15`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: getStatusColor(activity.status),
          border: `2px solid ${getStatusColor(activity.status)}30`,
        }}
      >
        {activity.icon}
      </div>
    ),
    children: (
      <div style={{ marginLeft: "16px", marginBottom: "24px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "8px",
          }}
        >
          <Text strong style={{ fontSize: "14px" }}>
            {activity.action}
          </Text>
          <Tag
            color={getStatusColor(activity.status)}
            style={{
              fontSize: "11px",
              padding: "0 6px",
              height: "20px",
              lineHeight: "18px",
              border: "none",
            }}
          >
            {activity.status}
          </Tag>
        </div>

        <Text
          style={{
            display: "block",
            color: darkTheme.secondaryText,
            fontSize: "13px",
            lineHeight: "18px",
            marginBottom: "8px",
          }}
        >
          {activity.description}
        </Text>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "8px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Avatar
              size={20}
              style={{ backgroundColor: darkTheme.borderColor, color: darkTheme.secondaryText }}
            >
              {activity.user.charAt(0)}
            </Avatar>
            <Text style={{ fontSize: "12px", color: darkTheme.secondaryText }}>
              {activity.user}
            </Text>
          </div>

          <Text style={{ fontSize: "12px", color: darkTheme.secondaryText }}>
            {activity.timestamp}
          </Text>
        </div>
      </div>
    ),
  }));

  return (
    <Card
      title={
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: "18px", fontWeight: "600", color: darkTheme.primaryText }}>
            {tr.recentActivities}
          </span>
          <Text style={{ color: darkTheme.secondaryText, fontSize: "12px" }}>
            {tr.last24Hours}
          </Text>
        </div>
      }
      style={{
        borderRadius: "16px",
        border: `1px solid ${darkTheme.borderColor}`,
        boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
        height: "100%",
        background: darkTheme.cardBg,
      }}
      bodyStyle={{
        padding: "24px",
        maxHeight: "600px",
        overflowY: "auto",
      }}
    >
      <Timeline items={timelineItems} style={{ marginTop: "16px" }} />
    </Card>
  );
};

export default RecentActivities;
