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
import tr from "../../../common/translations";
import { darkTheme } from "../../../common/darkTheme";

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
      message.error(tr.failedLoadVehicles);
      console.error("Error fetching vehicles:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (vehicleId, plateNumber) => {
    confirm({
      title: tr.deleteVehicle,
      icon: <ExclamationCircleOutlined />,
      content: `${tr.deleteVehicleConfirm} "${plateNumber}"?`,
      okText: tr.yesDelete,
      okType: "danger",
      cancelText: tr.cancel,
      onOk: async () => {
        try {
          await services.deleteVehicle(vehicleId);
          message.success(tr.vehicleDeletedSuccess);
          fetchVehicles(pagination.current, pagination.pageSize);
        } catch (error) {
          message.error(tr.failedDeleteVehicle);
          console.error("Error deleting vehicle:", error);
        }
      },
    });
  };

  const getVehicleTypeText = (type) => {
    const types = {
      1: tr.truck,
      2: tr.van,
      3: tr.container,
      4: tr.trailer,
      5: tr.tanker,
    };
    return types[type] || tr.unknown;
  };

  const getVehicleStatusTag = (status) => {
    const statusConfig = {
      1: { color: "success", text: tr.available },
      2: { color: "processing", text: tr.inTransit },
      3: { color: "warning", text: tr.maintenance },
      4: { color: "error", text: tr.outOfService },
      5: { color: "default", text: tr.inactive },
    };

    const config = statusConfig[status] || {
      color: "default",
      text: tr.unknown,
    };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const getActionItems = (record) => [
    {
      key: "view",
      icon: <EyeOutlined />,
      label: tr.viewDetails,
      onClick: () => {
        // Handle view vehicle details
        message.info("View vehicle details functionality");
      },
    },
    {
      key: "edit",
      icon: <EditOutlined />,
      label: tr.editVehicle,
      onClick: () => {
        // Handle edit vehicle
        message.info("Edit vehicle functionality");
      },
    },
    {
      key: "delete",
      icon: <DeleteOutlined />,
      label: tr.deleteVehicle,
      danger: true,
      onClick: () => handleDelete(record.id, record.plateNumber),
    },
  ];

  const columns = [
    {
      title: tr.vehicle,
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
            <div style={{ fontWeight: "600", fontSize: "14px", color: darkTheme.primaryText }}>
              {plateNumber}
            </div>
            <div style={{ color: darkTheme.secondaryText, fontSize: "12px" }}>
              {record.make} {record.model}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: tr.type,
      dataIndex: "vehicleType",
      key: "vehicleType",
      render: (type) => <Tag color="blue">{getVehicleTypeText(type)}</Tag>,
    },
    {
      title: tr.status,
      dataIndex: "status",
      key: "status",
      render: (status) => getVehicleStatusTag(status),
    },
    {
      title: tr.capacity,
      dataIndex: "payloadCapacity",
      key: "payloadCapacity",
      render: (capacity) => (capacity ? `${capacity} kg` : tr.na),
    },
    {
      title: tr.location,
      key: "location",
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <EnvironmentOutlined style={{ color: darkTheme.secondaryText }} />
          <span style={{ color: darkTheme.secondaryText, fontSize: "12px" }}>
            {record.lastKnownLat && record.lastKnownLng ? tr.located : tr.unknown}
          </span>
        </div>
      ),
    },
    {
      title: tr.actions,
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
          <span style={{ fontSize: "18px", fontWeight: "600", color: darkTheme.primaryText }}>
            {tr.recentVehicles}
          </span>
          <Button type="primary" size="small">
            {tr.viewAll}
          </Button>
        </div>
      }
      style={{
        borderRadius: "16px",
        border: `1px solid ${darkTheme.borderColor}`,
        boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
        background: darkTheme.cardBg,
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
            `${range[0]}-${range[1]} / ${total} ${tr.vehiclesOf}`,
        }}
        onChange={handleTableChange}
        rowKey="id"
        size="middle"
      />
    </Card>
  );
};

export default VehiclesList;
