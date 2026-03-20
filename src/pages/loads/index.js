import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Button,
  Input,
  Select,
  Row,
  Col,
  DatePicker,
  Space,
  message,
  Modal,
  Dropdown,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  ExclamationCircleOutlined,
  EnvironmentOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../common/components/MainLayout";
import LoadDetailsModal from "./components/LoadDetailsModal";
import LoadStatusTag from "./components/LoadStatusTag";
import LoadStopsColumn from "./components/LoadStopsColumn";
import { services } from "../../common/services";
import MatchLoadModal from "./components/MatchLoadModal";

const { Option } = Select;
const { RangePicker } = DatePicker;
const { confirm } = Modal;

const Loads = () => {
  const [loads, setLoads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedLoad, setSelectedLoad] = useState(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [matchModalVisible, setMatchModalVisible] = useState(false);
  const [selectedLoadForMatch, setSelectedLoadForMatch] = useState(null);
  const [filters, setFilters] = useState({
    title: "",
    city: "",
    district: "",
    minWeight: null,
    maxWeight: null,
    minVolume: null,
    maxVolume: null,
    startDate: null,
    endDate: null,
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");

  useEffect(() => {
    fetchLoads();
  }, []);

  const fetchLoads = async (page = 1, pageSize = 10, searchFilters = {}) => {
    try {
      setLoading(true);
      const response = await services.getLoadsList({
        pageNumber: page,
        pageSize: pageSize,
        ...filters,
        ...searchFilters,
      });

      setLoads(response || []);
      setPagination((prev) => ({
        ...prev,
        current: page,
        pageSize: pageSize,
        total: response?.length || 0,
      }));
    } catch (error) {
      message.error("Yükler yüklenemedi");
      console.error("Error fetching loads:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMatch = (load) => {
    setSelectedLoadForMatch(load);
    setMatchModalVisible(true);
  };

  const handleSearch = () => {
    fetchLoads(1, pagination.pageSize, filters);
  };

  const handleReset = () => {
    setFilters({
      title: "",
      city: "",
      district: "",
      minWeight: null,
      maxWeight: null,
      minVolume: null,
      maxVolume: null,
      startDate: null,
      endDate: null,
    });
    fetchLoads(1, pagination.pageSize, {});
  };

  const handleDelete = (loadId, loadTitle) => {
    confirm({
      title: "Yük Sil",
      icon: <ExclamationCircleOutlined />,
      content: `"${loadTitle}" yükünü silmek istediğinize emin misiniz?`,
      okText: "Evet, Sil",
      okType: "danger",
      cancelText: "İptal",
      onOk: async () => {
        try {
          await services.deleteLoad(loadId, userInfo.userId);
          message.success("Yük başarıyla silindi");
          fetchLoads(pagination.current, pagination.pageSize);
        } catch (error) {
          message.error("Yük silinemedi");
        }
      },
    });
  };

  const handleViewDetails = (load) => {
    setSelectedLoad(load);
    setDetailsModalVisible(true);
  };

  const getLoadStatus = (load) => {
    if (load.completedAt) return "completed";
    if (load.matchedAt) return "matched";
    if (load.publishedAt) return "published";
    return "draft";
  };

  const getActionItems = (record) => [
    {
      key: "view",
      icon: <EyeOutlined />,
      label: "Detayları Gör",
      onClick: () => handleViewDetails(record),
    },
    {
      key: "match",
      icon: <CheckCircleOutlined />,
      label: "Eşleştir",
      onClick: () => handleMatch(record),
    },
    {
      key: "edit",
      icon: <EditOutlined />,
      label: "Düzenle",
      onClick: () => navigate(`/edit-load/${record.id}`),
    },
    {
      key: "delete",
      icon: <DeleteOutlined />,
      label: "Sil",
      danger: true,
      onClick: () => handleDelete(record.id, record.title),
    },
  ];

  const columns = [
    {
      title: "Yük",
      dataIndex: "title",
      key: "title",
      fixed: "left",
      width: 300,
      render: (title, record) => (
        <div>
          <div
            style={{ fontWeight: "600", fontSize: "14px", marginBottom: "4px" }}
          >
            {title}
          </div>
          {record.description && (
            <div
              style={{
                color: "#8c8c8c",
                fontSize: "12px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: "280px",
              }}
            >
              {record.description}
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Durum",
      key: "status",
      width: 120,
      render: (_, record) => <LoadStatusTag status={getLoadStatus(record)} />,
    },
    {
      title: "Duraklar",
      key: "stops",
      width: 300,
      render: (_, record) => <LoadStopsColumn stops={record.loadStops || []} />,
    },
    {
      title: "Ağırlık / Hacim",
      key: "specs",
      width: 150,
      render: (_, record) => (
        <div style={{ fontSize: "13px" }}>
          {record.weight && (
            <div>
              <strong>Ağırlık:</strong> {record.weight} kg
            </div>
          )}
          {record.volume && (
            <div>
              <strong>Hacim:</strong> {record.volume} m³
            </div>
          )}
          {!record.weight && !record.volume && (
            <span style={{ color: "#8c8c8c" }}>—</span>
          )}
        </div>
      ),
    },
    {
      title: "İletişim",
      key: "contact",
      width: 200,
      render: (_, record) => (
        <div style={{ fontSize: "12px" }}>
          {record.contactPersonName && (
            <div style={{ marginBottom: "2px" }}>
              <strong>{record.contactPersonName}</strong>
            </div>
          )}
          {record.contactPhone && (
            <div style={{ color: "#8c8c8c" }}>{record.contactPhone}</div>
          )}
          {record.contactEmail && (
            <div style={{ color: "#8c8c8c" }}>{record.contactEmail}</div>
          )}
        </div>
      ),
    },
    {
      title: "Oluşturulma",
      dataIndex: "createdDate",
      key: "createdDate",
      width: 120,
      render: (date) => (
        <span style={{ fontSize: "12px", color: "#8c8c8c" }}>
          {new Date(date).toLocaleDateString("tr-TR")}
        </span>
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

  const handleDateRangeChange = (dates) => {
    setFilters({
      ...filters,
      startDate: dates ? dates[0]?.toISOString() : null,
      endDate: dates ? dates[1]?.toISOString() : null,
    });
  };

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
                Yükler
              </h1>
              <p
                style={{
                  color: "#8c8c8c",
                  fontSize: "16px",
                  marginTop: "8px",
                  margin: 0,
                }}
              >
                Nakliye yüklerinizi yönetin
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
              onClick={() => navigate("/create-load")}
            >
              Yük Oluştur
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
              <Col xs={24} sm={12} md={6}>
                <Input
                  placeholder="Başlığa göre ara"
                  prefix={<SearchOutlined />}
                  value={filters.title}
                  onChange={(e) =>
                    setFilters({ ...filters, title: e.target.value })
                  }
                  size="large"
                  style={{ borderRadius: "8px" }}
                />
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Input
                  placeholder="Şehir"
                  prefix={<EnvironmentOutlined />}
                  value={filters.city}
                  onChange={(e) =>
                    setFilters({ ...filters, city: e.target.value })
                  }
                  size="large"
                  style={{ borderRadius: "8px" }}
                />
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Input
                  placeholder="İlçe"
                  value={filters.district}
                  onChange={(e) =>
                    setFilters({ ...filters, district: e.target.value })
                  }
                  size="large"
                  style={{ borderRadius: "8px" }}
                />
              </Col>
              <Col xs={24} sm={12} md={6}>
                <RangePicker
                  placeholder={["Başlangıç Tarihi", "Bitiş Tarihi"]}
                  onChange={handleDateRangeChange}
                  size="large"
                  style={{ width: "100%", borderRadius: "8px" }}
                />
              </Col>
              <Col xs={24} sm={12} md={4}>
                <Input
                  type="number"
                  placeholder="Min Ağırlık (kg)"
                  value={filters.minWeight}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      minWeight: e.target.value ? Number(e.target.value) : null,
                    })
                  }
                  size="large"
                  style={{ borderRadius: "8px" }}
                />
              </Col>
              <Col xs={24} sm={12} md={4}>
                <Input
                  type="number"
                  placeholder="Maks Ağırlık (kg)"
                  value={filters.maxWeight}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      maxWeight: e.target.value ? Number(e.target.value) : null,
                    })
                  }
                  size="large"
                  style={{ borderRadius: "8px" }}
                />
              </Col>
              <Col xs={24} sm={12} md={4}>
                <Input
                  type="number"
                  placeholder="Min Hacim (m³)"
                  value={filters.minVolume}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      minVolume: e.target.value ? Number(e.target.value) : null,
                    })
                  }
                  size="large"
                  style={{ borderRadius: "8px" }}
                />
              </Col>
              <Col xs={24} sm={12} md={4}>
                <Input
                  type="number"
                  placeholder="Maks Hacim (m³)"
                  value={filters.maxVolume}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      maxVolume: e.target.value ? Number(e.target.value) : null,
                    })
                  }
                  size="large"
                  style={{ borderRadius: "8px" }}
                />
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
              dataSource={loads}
              loading={loading}
              pagination={{
                ...pagination,
                showSizeChanger: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} / ${total} yük`,
              }}
              onChange={(newPagination) => {
                fetchLoads(newPagination.current, newPagination.pageSize);
              }}
              rowKey="id"
              scroll={{ x: 1400 }}
            />
          </Card>

          {/* Details Modal */}
          <LoadDetailsModal
            visible={detailsModalVisible}
            load={selectedLoad}
            onClose={() => {
              setDetailsModalVisible(false);
              setSelectedLoad(null);
            }}
          />
        </div>
      </div>
      <MatchLoadModal
        visible={matchModalVisible}
        load={selectedLoadForMatch}
        onClose={() => {
          setMatchModalVisible(false);
          setSelectedLoadForMatch(null);
        }}
        onSuccess={() => {
          fetchLoads(pagination.current, pagination.pageSize);
        }}
      />
    </MainLayout>
  );
};

export default Loads;
