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
      message.error("Araçlar yüklenemedi");
      console.error("Error fetching vehicles:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (vehicleId, plateNumber) => {
    confirm({
      title: "Araç Sil",
      icon: <ExclamationCircleOutlined />,
      content: `"${plateNumber}" plakalı aracı silmek istediğinize emin misiniz?`,
      okText: "Evet, Sil",
      okType: "danger",
      cancelText: "İptal",
      onOk: async () => {
        try {
          await services.deleteVehicle(vehicleId);
          message.success("Araç başarıyla silindi");
          fetchVehicles(pagination.current, pagination.pageSize);
        } catch (error) {
          message.error("Araç silinemedi");
          console.error("Error deleting vehicle:", error);
        }
      },
    });
  };

  const getVehicleTypeText = (type) => {
    const types = {
      1: "Kamyon",
      2: "Kamyonet",
      3: "Konteyner",
      4: "Dorse",
      5: "Tanker",
    };
    return types[type] || "Bilinmiyor";
  };

  const getVehicleStatusTag = (status) => {
    const statusConfig = {
      1: { text: "Müsait" },
      2: { text: "Yolda" },
      3: { text: "Bakımda" },
      4: { text: "Hizmet Dışı" },
      5: { text: "Pasif" },
    };

    const config = statusConfig[status] || { text: "Bilinmiyor" };
    return (
      <Tag
        style={{
          border: "1px solid #e8e8e8",
          background: "#f5f5f5",
          color: "#595959",
          borderRadius: "4px",
        }}
      >
        {config.text}
      </Tag>
    );
  };

  const getActionItems = (record) => [
    {
      key: "view",
      icon: <EyeOutlined />,
      label: "Detayları Gör",
      onClick: () => {
        message.info("Araç detayları işlevi");
      },
    },
    {
      key: "edit",
      icon: <EditOutlined />,
      label: "Düzenle",
      onClick: () => {
        message.info("Araç düzenleme işlevi");
      },
    },
    {
      key: "delete",
      icon: <DeleteOutlined />,
      label: "Sil",
      danger: true,
      onClick: () => handleDelete(record.id, record.plateNumber),
    },
  ];

  const columns = [
    {
      title: "Araç",
      dataIndex: "plateNumber",
      key: "plateNumber",
      render: (plateNumber, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "8px",
              backgroundColor: "#f5f5f5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#111111",
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
      title: "Tür",
      dataIndex: "vehicleType",
      key: "vehicleType",
      render: (type) => (
        <Tag
          style={{
            border: "1px solid #e8e8e8",
            background: "#f5f5f5",
            color: "#595959",
          }}
        >
          {getVehicleTypeText(type)}
        </Tag>
      ),
    },
    {
      title: "Durum",
      dataIndex: "status",
      key: "status",
      render: (status) => getVehicleStatusTag(status),
    },
    {
      title: "Kapasite",
      dataIndex: "payloadCapacity",
      key: "payloadCapacity",
      render: (capacity) => (capacity ? `${capacity} kg` : "—"),
    },
    {
      title: "Konum",
      key: "location",
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <EnvironmentOutlined style={{ color: "#8c8c8c" }} />
          <span style={{ color: "#8c8c8c", fontSize: "12px" }}>
            {record.lastKnownLat && record.lastKnownLng ? "Konumlu" : "Bilinmiyor"}
          </span>
        </div>
      ),
    },
    {
      title: "İşlem",
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
            Son Araçlar
          </span>
          <Button
            size="small"
            style={{ borderRadius: "6px", borderColor: "#111111", color: "#111111" }}
          >
            Tümünü Gör
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
            `${range[0]}-${range[1]} / ${total} araç`,
        }}
        onChange={handleTableChange}
        rowKey="id"
        size="middle"
      />
    </Card>
  );
};

export default VehiclesList;
