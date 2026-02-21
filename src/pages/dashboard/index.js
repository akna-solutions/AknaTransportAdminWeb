import React, { useState, useEffect } from "react";
import { Row, Col, message } from "antd";
import MainLayout from "../../common/components/MainLayout";
import DashboardHeader from "./components/DashboardHeader";
import DashboardStats from "./components/DashboardStats";
import VehiclesList from "./components/VehiclesList";
import UsersList from "./components/UsersList";
import RecentActivities from "./components/RecentActivities";
import { services } from "../../common/services";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalVehicles: 0,
    activeDrivers: 0,
    pendingBookings: 0,
    unpaidInvoices: 0,
    onTimeDeliveryRate: 85,
    vehicleUtilization: 78,
    responseTime: 92,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch basic stats from API
      const [vehiclesResponse, usersResponse] = await Promise.all([
        services.getVehiclesList({ pageSize: 100 }).catch(() => []),
        services.getUsersList({ pageSize: 100 }).catch(() => []),
      ]);

      // Calculate stats from API responses
      const totalVehicles = vehiclesResponse?.length || 0;
      const totalUsers = usersResponse?.length || 0;
      const activeDrivers =
        usersResponse?.filter((user) => user.userType === 1)?.length || 0;

      // Mock data for other stats (these would come from actual API endpoints)
      setStats((prevStats) => ({
        ...prevStats,
        totalVehicles,
        activeDrivers,
        pendingBookings: 4, // Mock data
        unpaidInvoices: 2, // Mock data
      }));
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      message.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div style={{ minHeight: "100vh", background: "#f5f5f5" }}>
        {/* Header */}
        <DashboardHeader />

        {/* Main Content */}
        <div style={{ padding: "0 40px 40px 40px" }}>
          {/* Statistics Cards */}
          <div style={{ marginBottom: "32px" }}>
            <DashboardStats stats={stats} />
          </div>

          {/* Data Tables and Activities */}
          <Row gutter={[24, 24]}>
            {/* Left Column - Tables */}
            <Col xs={24} lg={16}>
              <Row gutter={[24, 24]}>
                <Col xs={24}>
                  <VehiclesList />
                </Col>
                <Col xs={24}>
                  <UsersList />
                </Col>
              </Row>
            </Col>

            {/* Right Column - Activities */}
            <Col xs={24} lg={8}>
              <RecentActivities />
            </Col>
          </Row>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
