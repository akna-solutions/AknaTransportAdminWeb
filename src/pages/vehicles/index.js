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
      message.error("Araçlar yüklenemedi");
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
        }
      },
    });
  };

  const getVehicleTypeText = (type) => {
    const types = {
      1: "Kamyon",
      2: "Çekici",
      3: "Dorse",
      4: "Kamyonet",
      5: "Pikap",
    };
    return types[type] || "Bilinmiyor";
  };

  const getVehicleStatusTag = (status) => {
    const statusConfig = {
      1: { text: "Müsait" },
      2: { text: "Bakımda" },
      3: { text: "Pasif" },
      4: { text: "Hizmet Dışı" },
      5: { text: "Görevde" },
    };

    const config = statusConfig[status] || { text: "Bilinmiyor" };
    return (
      <Tag
        style={{
          border: "1px solid #e8e8e8",
          background: "#f5f5f5",
          color: "#595959",
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
      onClick: () => message.info("Araç detayları işlevi"),
    },
    {
      key: "edit",
      icon: <EditOutlined />,
      label: "Düzenle",
      onClick: () => message.info("Araç düzenleme işlevi"),
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
      fixed: "left",
      width: 250,
      render: (plateNumber, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              backgroundColor: "#f5f5f5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#111111",
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
      title: "Tür",
      dataIndex: "vehicleType",
      key: "vehicleType",
      width: 120,
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
      width: 130,
      render: (status) => getVehicleStatusTag(status),
    },
    {
      title: "Yıl",
      dataIndex: "modelYear",
      key: "modelYear",
      width: 100,
      render: (year) => year || "—",
    },
    {
      title: "Kapasite",
      dataIndex: "payloadCapacity",
      key: "payloadCapacity",
      width: 120,
      render: (capacity) => (capacity ? `${capacity} kg` : "—"),
    },
    {
      title: "Hacim",
      dataIndex: "cargoVolume",
      key: "cargoVolume",
      width: 120,
      render: (volume) => (volume ? `${volume} m³` : "—"),
    },
    {
      title: "Özellikler",
      key: "features",
      width: 200,
      render: (_, record) => (
        <Space size="small" wrap>
          {record.isRefrigerated && (
            <Tag
              style={{
                margin: 0,
                border: "1px solid #e8e8e8",
                background: "#f5f5f5",
                color: "#595959",
              }}
            >
              Soğutmalı
            </Tag>
          )}
          {record.hazmatAllowed && (
            <Tag
              style={{
                margin: 0,
                border: "1px solid #e8e8e8",
                background: "#f5f5f5",
                color: "#595959",
              }}
            >
              Tehlikeli Madde
            </Tag>
          )}
          {record.hasLiftgate && (
            <Tag
              style={{
                margin: 0,
                border: "1px solid #e8e8e8",
                background: "#f5f5f5",
                color: "#595959",
              }}
            >
              Lift Kapı
            </Tag>
          )}
        </Space>
      ),
    },
    {
      title: "Konum",
      key: "location",
      width: 120,
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
                Araçlar
              </h1>
              <p
                style={{
                  color: "#8c8c8c",
                  fontSize: "16px",
                  marginTop: "8px",
                  margin: 0,
                }}
              >
                Filo araçlarınızı yönetin
              </p>
            </div>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              size="large"
              style={{
                borderRadius: "8px",
                background: "#111111",
                border: "none",
                height: "48px",
              }}
              onClick={() => message.info("Araç ekleme işlevi")}
            >
              Araç Ekle
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
                  placeholder="Plakaya göre ara"
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
                  placeholder="Araç Türü"
                  value={filters.vehicleType}
                  onChange={(value) =>
                    setFilters({ ...filters, vehicleType: value })
                  }
                  style={{ width: "100%", borderRadius: "8px" }}
                  size="large"
                  allowClear
                >
                  <Option value={1}>Kamyon</Option>
                  <Option value={2}>Çekici</Option>
                  <Option value={3}>Dorse</Option>
                  <Option value={4}>Kamyonet</Option>
                  <Option value={5}>Pikap</Option>
                </Select>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Select
                  placeholder="Durum"
                  value={filters.status}
                  onChange={(value) =>
                    setFilters({ ...filters, status: value })
                  }
                  style={{ width: "100%", borderRadius: "8px" }}
                  size="large"
                  allowClear
                >
                  <Option value={1}>Müsait</Option>
                  <Option value={2}>Bakımda</Option>
                  <Option value={3}>Pasif</Option>
                  <Option value={4}>Hizmet Dışı</Option>
                  <Option value={5}>Görevde</Option>
                </Select>
              </Col>
              <Col xs={24} sm={12} md={4}>
                <Space style={{ width: "100%" }}>
                  <Button
                    type="primary"
                    icon={<SearchOutlined />}
                    onClick={handleSearch}
                    size="large"
                    style={{ borderRadius: "8px", background: "#111111", border: "none" }}
                  >
                    Ara
                  </Button>
                  <Button
                    onClick={handleReset}
                    size="large"
                    style={{ borderRadius: "8px" }}
                  >
                    Temizle
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
                  `${range[0]}-${range[1]} / ${total} araç`,
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
