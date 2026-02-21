import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Button,
  Input,
  Select,
  Row,
  Col,
  Tag,
  Space,
  message,
  Modal,
  Dropdown,
  Badge,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  FilterOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  CarOutlined,
  EnvironmentOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import MainLayout from "../../common/components/MainLayout";
import { services } from "../../common/services";

const { Option } = Select;
const { confirm } = Modal;

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    plateNumber: "",
    vehicleType: null,
    status: null,
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async (page = 1, pageSize = 10, searchFilters = {}) => {
    try {
      setLoading(true);
      const response = await services.getVehiclesList({
        page,
        pageSize,
        ...filters,
        ...searchFilters,
      });

      setVehicles(response || []);
      setPagination((prev) => ({
        ...prev,
        current: page,
        pageSize: pageSize,
        total: response?.length || 0,
      }));
    } catch (error) {
      message.error("Failed to load vehicles");
      console.error("Error fetching vehicles:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchVehicles(1, pagination.pageSize, filters);
  };

  const handleReset = () => {
    setFilters({
      plateNumber: "",
      vehicleType: null,
      status: null,
    });
    fetchVehicles(1, pagination.pageSize, {});
  };

  const handleDelete = (vehicleId, plateNumber) => {
    confirm({
      title: "Delete Vehicle",
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure you want to delete vehicle "${plateNumber}"?`,
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await services.deleteVehicle(vehicleId);
          message.success("Vehicle deleted successfully");
          fetchVehicles(pagination.current, pagination.pageSize);
        } catch (error) {
          message.error("Failed to delete vehicle");
        }
      },
    });
  };

  const getVehicleTypeText = (type) => {
    const types = {
      1: "Truck",
      2: "Tractor Unit",
      3: "Trailer",
      4: "Van",
      5: "Pickup",
    };
    return types[type] || "Unknown";
  };

  const getVehicleStatusTag = (status) => {
    const statusConfig = {
      1: { color: "success", text: "Available" },
      2: { color: "warning", text: "In Maintenance" },
      3: { color: "default", text: "Inactive" },
      4: { color: "error", text: "Decommissioned" },
      5: { color: "processing", text: "On Duty" },
    };

    const config = statusConfig[status] || {
      color: "default",
      text: "Unknown",
    };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const getActionItems = (record) => [
    {
      key: "view",
      icon: <EyeOutlined />,
      label: "View Details",
      onClick: () => message.info("View details functionality"),
    },
    {
      key: "edit",
      icon: <EditOutlined />,
      label: "Edit Vehicle",
      onClick: () => message.info("Edit vehicle functionality"),
    },
    {
      key: "delete",
      icon: <DeleteOutlined />,
      label: "Delete Vehicle",
      danger: true,
      onClick: () => handleDelete(record.id, record.plateNumber),
    },
  ];

  const columns = [
    {
      title: "Vehicle",
      dataIndex: "plateNumber",
      key: "plateNumber",
      fixed: "left",
      width: 250,
      render: (plateNumber, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              backgroundColor: "#667eea15",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#667eea",
            }}
          >
            <CarOutlined style={{ fontSize: "20px" }} />
          </div>
          <div>
            <div style={{ fontWeight: "600", fontSize: "14px" }}>
              {plateNumber}
            </div>
            <div style={{ color: "#8c8c8c", fontSize: "12px" }}>
              {record.make} {record.model}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Type",
      dataIndex: "vehicleType",
      key: "vehicleType",
      width: 120,
      render: (type) => <Tag color="blue">{getVehicleTypeText(type)}</Tag>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 130,
      render: (status) => getVehicleStatusTag(status),
    },
    {
      title: "Year",
      dataIndex: "modelYear",
      key: "modelYear",
      width: 100,
      render: (year) => year || "N/A",
    },
    {
      title: "Capacity",
      dataIndex: "payloadCapacity",
      key: "payloadCapacity",
      width: 120,
      render: (capacity) => (capacity ? `${capacity} kg` : "N/A"),
    },
    {
      title: "Volume",
      dataIndex: "cargoVolume",
      key: "cargoVolume",
      width: 120,
      render: (volume) => (volume ? `${volume} m³` : "N/A"),
    },
    {
      title: "Features",
      key: "features",
      width: 200,
      render: (_, record) => (
        <Space size="small" wrap>
          {record.isRefrigerated && (
            <Tag color="cyan" style={{ margin: 0 }}>
              Refrigerated
            </Tag>
          )}
          {record.hazmatAllowed && (
            <Tag color="orange" style={{ margin: 0 }}>
              Hazmat
            </Tag>
          )}
          {record.hasLiftgate && (
            <Tag color="purple" style={{ margin: 0 }}>
              Liftgate
            </Tag>
          )}
        </Space>
      ),
    },
    {
      title: "Location",
      key: "location",
      width: 120,
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <EnvironmentOutlined style={{ color: "#8c8c8c" }} />
          <span style={{ color: "#8c8c8c", fontSize: "12px" }}>
            {record.lastKnownLat && record.lastKnownLng ? "Located" : "Unknown"}
          </span>
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      width: 80,
      render: (_, record) => (
        <Dropdown
          menu={{
            items: getActionItems(record).map((item) => ({
              ...item,
              onClick: undefined,
            })),
            onClick: ({ key }) => {
              const action = getActionItems(record).find(
                (item) => item.key === key,
              );
              if (action && action.onClick) {
                action.onClick();
              }
            },
          }}
          trigger={["click"]}
          placement="bottomRight"
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  return (
    <MainLayout>
      <div
        style={{ padding: "40px", minHeight: "100vh", background: "#f5f5f5" }}
      >
        <div style={{ maxWidth: "1600px", margin: "0 auto" }}>
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "32px",
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: "32px",
                  fontWeight: "700",
                  color: "#1a1a1a",
                  margin: 0,
                }}
              >
                Vehicles
              </h1>
              <p
                style={{
                  color: "#8c8c8c",
                  fontSize: "16px",
                  marginTop: "8px",
                  margin: 0,
                }}
              >
                Manage your fleet vehicles
              </p>
            </div>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              size="large"
              style={{
                borderRadius: "8px",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                border: "none",
                height: "48px",
              }}
              onClick={() => message.info("Add vehicle functionality")}
            >
              Add Vehicle
            </Button>
          </div>

          {/* Filters */}
          <Card
            style={{
              borderRadius: "16px",
              marginBottom: "24px",
              border: "1px solid #f0f0f0",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            }}
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={8}>
                <Input
                  placeholder="Search by plate number"
                  prefix={<SearchOutlined />}
                  value={filters.plateNumber}
                  onChange={(e) =>
                    setFilters({ ...filters, plateNumber: e.target.value })
                  }
                  size="large"
                  style={{ borderRadius: "8px" }}
                />
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Select
                  placeholder="Vehicle Type"
                  value={filters.vehicleType}
                  onChange={(value) =>
                    setFilters({ ...filters, vehicleType: value })
                  }
                  style={{ width: "100%", borderRadius: "8px" }}
                  size="large"
                  allowClear
                >
                  <Option value={1}>Truck</Option>
                  <Option value={2}>Tractor Unit</Option>
                  <Option value={3}>Trailer</Option>
                  <Option value={4}>Van</Option>
                  <Option value={5}>Pickup</Option>
                </Select>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Select
                  placeholder="Status"
                  value={filters.status}
                  onChange={(value) =>
                    setFilters({ ...filters, status: value })
                  }
                  style={{ width: "100%", borderRadius: "8px" }}
                  size="large"
                  allowClear
                >
                  <Option value={1}>Available</Option>
                  <Option value={2}>In Maintenance</Option>
                  <Option value={3}>Inactive</Option>
                  <Option value={4}>Decommissioned</Option>
                  <Option value={5}>On Duty</Option>
                </Select>
              </Col>
              <Col xs={24} sm={12} md={4}>
                <Space style={{ width: "100%" }}>
                  <Button
                    type="primary"
                    icon={<SearchOutlined />}
                    onClick={handleSearch}
                    size="large"
                    style={{ borderRadius: "8px" }}
                  >
                    Search
                  </Button>
                  <Button
                    onClick={handleReset}
                    size="large"
                    style={{ borderRadius: "8px" }}
                  >
                    Reset
                  </Button>
                </Space>
              </Col>
            </Row>
          </Card>

          {/* Table */}
          <Card
            style={{
              borderRadius: "16px",
              border: "1px solid #f0f0f0",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            }}
          >
            <Table
              columns={columns}
              dataSource={vehicles}
              loading={loading}
              pagination={{
                ...pagination,
                showSizeChanger: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} vehicles`,
              }}
              onChange={(newPagination) => {
                fetchVehicles(newPagination.current, newPagination.pageSize);
              }}
              rowKey="id"
              scroll={{ x: 1400 }}
            />
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Vehicles;
