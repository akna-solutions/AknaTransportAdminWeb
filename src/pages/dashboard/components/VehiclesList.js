import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Tag,
  Button,
  Space,
  Tooltip,
  message,
  Modal,
  Dropdown,
} from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  ExclamationCircleOutlined,
  CarOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { services } from "../../../common/services";

const { confirm } = Modal;

const VehiclesList = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async (page = 1, pageSize = 5, filters = {}) => {
    try {
      setLoading(true);
      const response = await services.getVehiclesList({
        page,
        pageSize,
        ...filters,
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
          console.error("Error deleting vehicle:", error);
        }
      },
    });
  };

  const getVehicleTypeText = (type) => {
    const types = {
      1: "Truck",
      2: "Van",
      3: "Container",
      4: "Trailer",
      5: "Tanker",
    };
    return types[type] || "Unknown";
  };

  const getVehicleStatusTag = (status) => {
    const statusConfig = {
      1: { color: "success", text: "Available" },
      2: { color: "processing", text: "In Transit" },
      3: { color: "warning", text: "Maintenance" },
      4: { color: "error", text: "Out of Service" },
      5: { color: "default", text: "Inactive" },
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
      onClick: () => {
        // Handle view vehicle details
        message.info("View vehicle details functionality");
      },
    },
    {
      key: "edit",
      icon: <EditOutlined />,
      label: "Edit Vehicle",
      onClick: () => {
        // Handle edit vehicle
        message.info("Edit vehicle functionality");
      },
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
      render: (plateNumber, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "8px",
              backgroundColor: "#667eea15",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#667eea",
            }}
          >
            <CarOutlined style={{ fontSize: "18px" }} />
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
      render: (type) => <Tag color="blue">{getVehicleTypeText(type)}</Tag>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => getVehicleStatusTag(status),
    },
    {
      title: "Capacity",
      dataIndex: "payloadCapacity",
      key: "payloadCapacity",
      render: (capacity) => (capacity ? `${capacity} kg` : "N/A"),
    },
    {
      title: "Location",
      key: "location",
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
      width: 60,
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
          <Button type="text" icon={<MoreOutlined />} size="small" />
        </Dropdown>
      ),
    },
  ];

  const handleTableChange = (pagination) => {
    fetchVehicles(pagination.current, pagination.pageSize);
  };

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
            Recent Vehicles
          </span>
          <Button type="primary" size="small">
            View All
          </Button>
        </div>
      }
      style={{
        borderRadius: "16px",
        border: "1px solid #f0f0f0",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      }}
      bodyStyle={{ padding: "24px" }}
    >
      <Table
        columns={columns}
        dataSource={vehicles}
        loading={loading}
        pagination={{
          ...pagination,
          showSizeChanger: false,
          showQuickJumper: false,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} vehicles`,
        }}
        onChange={handleTableChange}
        rowKey="id"
        size="middle"
      />
    </Card>
  );
};

export default VehiclesList;
