import React from "react";
import { Card, Row, Col, Statistic, Progress } from "antd";
import {
  CarOutlined,
  UserOutlined,
  CalendarOutlined,
  FileTextOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";

const DashboardStats = ({ stats }) => {
  const statisticsData = [
    {
      title: "Total Vehicles",
      value: stats?.totalVehicles || 0,
      icon: <CarOutlined style={{ color: "#1890ff" }} />,
      color: "#1890ff",
      prefix: null,
      suffix: null,
    },
    {
      title: "Active Drivers",
      value: stats?.activeDrivers || 0,
      icon: <UserOutlined style={{ color: "#52c41a" }} />,
      color: "#52c41a",
      prefix: null,
      suffix: null,
    },
    {
      title: "Pending Bookings",
      value: stats?.pendingBookings || 0,
      icon: <CalendarOutlined style={{ color: "#faad14" }} />,
      color: "#faad14",
      prefix: null,
      suffix: null,
    },
    {
      title: "Unpaid Invoices",
      value: stats?.unpaidInvoices || 0,
      icon: <FileTextOutlined style={{ color: "#ff4d4f" }} />,
      color: "#ff4d4f",
      prefix: null,
      suffix: null,
    },
  ];

  const performanceData = [
    {
      title: "On-Time Deliveries",
      percent: stats?.onTimeDeliveryRate || 85,
      color: "#52c41a",
      icon: <TrophyOutlined />,
    },
    {
      title: "Vehicle Utilization",
      percent: stats?.vehicleUtilization || 78,
      color: "#1890ff",
      icon: <CarOutlined />,
    },
    {
      title: "Average Response Time",
      percent: stats?.responseTime || 92,
      color: "#faad14",
      icon: <ClockCircleOutlined />,
    },
  ];

  return (
    <div>
      {/* Main Statistics */}
      <Row gutter={[24, 24]} style={{ marginBottom: "32px" }}>
        {statisticsData.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card
              style={{
                borderRadius: "16px",
                border: "1px solid #f0f0f0",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              }}
              bodyStyle={{ padding: "24px" }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <Statistic
                    title={stat.title}
                    value={stat.value}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                    valueStyle={{
                      color: stat.color,
                      fontSize: "28px",
                      fontWeight: "bold",
                      lineHeight: "32px",
                    }}
                    titleStyle={{
                      color: "#8c8c8c",
                      fontSize: "14px",
                      fontWeight: "normal",
                      marginBottom: "8px",
                    }}
                  />
                </div>
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    backgroundColor: `${stat.color}15`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "20px",
                  }}
                >
                  {stat.icon}
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Performance Metrics */}
      <Row gutter={[24, 24]}>
        {performanceData.map((metric, index) => (
          <Col xs={24} sm={8} key={index}>
            <Card
              title={
                <div
                  style={{ display: "flex", alignItems: "center", gap: "12px" }}
                >
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "8px",
                      backgroundColor: `${metric.color}15`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: metric.color,
                    }}
                  >
                    {metric.icon}
                  </div>
                  <span style={{ fontSize: "16px", fontWeight: "600" }}>
                    {metric.title}
                  </span>
                </div>
              }
              style={{
                borderRadius: "16px",
                border: "1px solid #f0f0f0",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              }}
              bodyStyle={{ padding: "24px" }}
            >
              <div style={{ textAlign: "center" }}>
                <Progress
                  type="circle"
                  percent={metric.percent}
                  size={120}
                  strokeColor={metric.color}
                  strokeWidth={8}
                  format={(percent) => (
                    <span
                      style={{
                        color: metric.color,
                        fontSize: "24px",
                        fontWeight: "bold",
                      }}
                    >
                      {percent}%
                    </span>
                  )}
                />
                <div
                  style={{
                    marginTop: "16px",
                    color: "#8c8c8c",
                    fontSize: "14px",
                  }}
                >
                  Current Performance
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default DashboardStats;
