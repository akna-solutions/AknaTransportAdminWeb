import React from "react";
import { Card, Row, Col, Statistic, Progress } from "antd";
import {
  CarOutlined,
  UserOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";

const DashboardStats = ({ stats }) => {
  const statisticsData = [
    {
      title: "Toplam Araç",
      value: stats?.totalVehicles || 0,
      icon: <CarOutlined style={{ color: "#111111" }} />,
      color: "#111111",
    },
    {
      title: "Aktif Sürücü",
      value: stats?.activeDrivers || 0,
      icon: <UserOutlined style={{ color: "#111111" }} />,
      color: "#111111",
    },
  ];

  const performanceData = [
    {
      title: "Zamanında Teslimat",
      percent: stats?.onTimeDeliveryRate || 85,
      color: "#111111",
      icon: <TrophyOutlined />,
    },
    {
      title: "Araç Kullanımı",
      percent: stats?.vehicleUtilization || 78,
      color: "#444444",
      icon: <CarOutlined />,
    },
    {
      title: "Ortalama Yanıt Süresi",
      percent: stats?.responseTime || 92,
      color: "#777777",
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
                    backgroundColor: "#f5f5f5",
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
                      backgroundColor: "#f5f5f5",
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
                  Güncel Performans
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
