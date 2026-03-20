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

const { Text } = Typography;

const RecentActivities = () => {
  const activities = [
    {
      id: 1,
      type: "vehicle",
      action: "Araç Eklendi",
      description: "Yeni kamyon BMW X7 (34-ABC-123) filoya eklendi",
      user: "Yönetici",
      timestamp: "2 saat önce",
      status: "success",
      icon: <CarOutlined />,
    },
    {
      id: 2,
      type: "user",
      action: "Sürücü Kaydedildi",
      description: "Ahmet Yılmaz kaydını ve doğrulamasını tamamladı",
      user: "Ahmet Yılmaz",
      timestamp: "4 saat önce",
      status: "success",
      icon: <UserOutlined />,
    },
    {
      id: 3,
      type: "booking",
      action: "Rezervasyon Onaylandı",
      description: "İstanbul'dan Ankara'ya teslimat yarın için planlandı",
      user: "Nakliye Müdürü",
      timestamp: "6 saat önce",
      status: "processing",
      icon: <CalendarOutlined />,
    },
    {
      id: 4,
      type: "maintenance",
      action: "Bakım Gerekli",
      description: "06-XYZ-789 plakalı araç bakım zamanı geldi",
      user: "Sistem",
      timestamp: "8 saat önce",
      status: "warning",
      icon: <ExclamationCircleOutlined />,
    },
    {
      id: 5,
      type: "invoice",
      action: "Fatura Oluşturuldu",
      description: "#FAT-2024-001 numaralı fatura tamamlanan teslimat için oluşturuldu",
      user: "Muhasebe",
      timestamp: "12 saat önce",
      status: "success",
      icon: <FileTextOutlined />,
    },
    {
      id: 6,
      type: "user",
      action: "Sürücü Güncellendi",
      description: "Fatma Demir profil bilgilerini güncelledi",
      user: "Fatma Demir",
      timestamp: "1 gün önce",
      status: "default",
      icon: <UserOutlined />,
    },
  ];

  const getStatusColor = (status) => {
    const colors = {
      success: "#333333",
      processing: "#555555",
      warning: "#777777",
      error: "#111111",
      default: "#999999",
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

  const getStatusLabel = (status) => {
    const labels = {
      success: "başarılı",
      processing: "işlemde",
      warning: "uyarı",
      error: "hata",
      default: "bekliyor",
    };
    return labels[status] || labels.default;
  };

  const timelineItems = activities.map((activity) => ({
    dot: (
      <div
        style={{
          width: "32px",
          height: "32px",
          borderRadius: "50%",
          backgroundColor: "#f5f5f5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: getStatusColor(activity.status),
          border: `2px solid #e8e8e8`,
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
            style={{
              fontSize: "11px",
              padding: "0 6px",
              height: "20px",
              lineHeight: "18px",
              border: "1px solid #e8e8e8",
              background: "#f5f5f5",
              color: "#666666",
            }}
          >
            {getStatusLabel(activity.status)}
          </Tag>
        </div>

        <Text
          style={{
            display: "block",
            color: "#595959",
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
              style={{ backgroundColor: "#f0f0f0", color: "#8c8c8c" }}
            >
              {activity.user.charAt(0)}
            </Avatar>
            <Text style={{ fontSize: "12px", color: "#8c8c8c" }}>
              {activity.user}
            </Text>
          </div>

          <Text style={{ fontSize: "12px", color: "#bfbfbf" }}>
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
          <span style={{ fontSize: "18px", fontWeight: "600" }}>
            Son Aktiviteler
          </span>
          <Text style={{ color: "#8c8c8c", fontSize: "12px" }}>
            Son 24 saat
          </Text>
        </div>
      }
      style={{
        borderRadius: "16px",
        border: "1px solid #f0f0f0",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        height: "100%",
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
