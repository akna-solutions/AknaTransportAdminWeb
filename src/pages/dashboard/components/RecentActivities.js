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
  // Mock data for recent activities
  const activities = [
    {
      id: 1,
      type: "vehicle",
      action: "Vehicle Added",
      description: "New truck BMW X7 (34-ABC-123) added to fleet",
      user: "Admin User",
      timestamp: "2 hours ago",
      status: "success",
      icon: <CarOutlined />,
    },
    {
      id: 2,
      type: "user",
      action: "Driver Registered",
      description: "John Doe completed registration and verification",
      user: "John Doe",
      timestamp: "4 hours ago",
      status: "success",
      icon: <UserOutlined />,
    },
    {
      id: 3,
      type: "booking",
      action: "Booking Confirmed",
      description: "Istanbul to Ankara delivery scheduled for tomorrow",
      user: "Transport Manager",
      timestamp: "6 hours ago",
      status: "processing",
      icon: <CalendarOutlined />,
    },
    {
      id: 4,
      type: "maintenance",
      action: "Maintenance Required",
      description: "Vehicle 06-XYZ-789 needs scheduled maintenance",
      user: "System",
      timestamp: "8 hours ago",
      status: "warning",
      icon: <ExclamationCircleOutlined />,
    },
    {
      id: 5,
      type: "invoice",
      action: "Invoice Generated",
      description: "Invoice #INV-2024-001 created for completed delivery",
      user: "Finance Team",
      timestamp: "12 hours ago",
      status: "success",
      icon: <FileTextOutlined />,
    },
    {
      id: 6,
      type: "user",
      action: "Driver Updated",
      description: "Sarah Wilson updated her profile information",
      user: "Sarah Wilson",
      timestamp: "1 day ago",
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
            Recent Activities
          </span>
          <Text style={{ color: "#8c8c8c", fontSize: "12px" }}>
            Last 24 hours
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
