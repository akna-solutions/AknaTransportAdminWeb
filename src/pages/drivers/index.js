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
  Avatar,
  Badge,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import MainLayout from "../../common/components/MainLayout";
import { services } from "../../common/services";

const { Option } = Select;
const { confirm } = Modal;

const Drivers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    userType: null,
    isEmailConfirmed: null,
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async (page = 1, pageSize = 10, searchFilters = {}) => {
    try {
      setLoading(true);
      const response = await services.getUsersList({
        page,
        pageSize,
        ...filters,
        ...searchFilters,
      });

      setUsers(response || []);
      setPagination((prev) => ({
        ...prev,
        current: page,
        pageSize: pageSize,
        total: response?.length || 0,
      }));
    } catch (error) {
      message.error("Failed to load users");
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchUsers(1, pagination.pageSize, filters);
  };

  const handleReset = () => {
    setFilters({
      name: "",
      email: "",
      userType: null,
      isEmailConfirmed: null,
    });
    fetchUsers(1, pagination.pageSize, {});
  };

  const handleDelete = (userId, userName) => {
    confirm({
      title: "Delete User",
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure you want to delete user "${userName}"?`,
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await services.deleteUser(userId);
          message.success("User deleted successfully");
          fetchUsers(pagination.current, pagination.pageSize);
        } catch (error) {
          message.error("Failed to delete user");
        }
      },
    });
  };

  const getUserTypeTag = (type) => {
    const types = {
      1: { color: "blue", text: "Company Employee" },
      2: { color: "green", text: "Driver" },
      99: { color: "gold", text: "System Admin" },
    };

    const config = types[type] || { color: "default", text: "Unknown" };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const getGenderText = (gender) => {
    return gender === 1 ? "Male" : gender === 2 ? "Female" : "N/A";
  };

  const getActionItems = (record) => [
    {
      key: "view",
      icon: <EyeOutlined />,
      label: "View Profile",
      onClick: () => message.info("View profile functionality"),
    },
    {
      key: "edit",
      icon: <EditOutlined />,
      label: "Edit User",
      onClick: () => message.info("Edit user functionality"),
    },
    {
      key: "delete",
      icon: <DeleteOutlined />,
      label: "Delete User",
      danger: true,
      onClick: () =>
        handleDelete(record.id, `${record.name} ${record.surname}`),
    },
  ];

  const columns = [
    {
      title: "User",
      dataIndex: "name",
      key: "name",
      fixed: "left",
      width: 280,
      render: (name, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Avatar
            size={48}
            style={{
              backgroundColor: "#667eea",
              color: "white",
              fontWeight: "bold",
              fontSize: "18px",
            }}
            src={record.profileImageUrl}
          >
            {name ? name.charAt(0).toUpperCase() : "U"}
          </Avatar>
          <div>
            <div style={{ fontWeight: "600", fontSize: "14px" }}>
              {name} {record.surname}
            </div>
            <div style={{ color: "#8c8c8c", fontSize: "12px" }}>
              @{record.userCode}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Contact",
      key: "contact",
      width: 280,
      render: (_, record) => (
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "13px",
              marginBottom: "6px",
            }}
          >
            <MailOutlined style={{ color: "#8c8c8c" }} />
            <span style={{ flex: 1 }}>{record.email}</span>
            {record.isEmailConfirmed ? (
              <CheckCircleOutlined
                style={{ color: "#52c41a", fontSize: "16px" }}
              />
            ) : (
              <CloseCircleOutlined
                style={{ color: "#ff4d4f", fontSize: "16px" }}
              />
            )}
          </div>
          {record.phoneNumber && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "13px",
                color: "#8c8c8c",
              }}
            >
              <PhoneOutlined />
              <span style={{ flex: 1 }}>{record.phoneNumber}</span>
              {record.isPhoneNumberConfirmed ? (
                <CheckCircleOutlined
                  style={{ color: "#52c41a", fontSize: "16px" }}
                />
              ) : (
                <CloseCircleOutlined
                  style={{ color: "#ff4d4f", fontSize: "16px" }}
                />
              )}
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Type",
      dataIndex: "userType",
      key: "userType",
      width: 180,
      render: (type) => getUserTypeTag(type),
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      width: 100,
      render: (gender) => (
        <span style={{ color: "#595959", fontSize: "13px" }}>
          {getGenderText(gender)}
        </span>
      ),
    },
    {
      title: "TC Number",
      dataIndex: "turkishRepublicIdNumber",
      key: "turkishRepublicIdNumber",
      width: 140,
      render: (tc) => (
        <span style={{ fontFamily: "monospace", fontSize: "13px" }}>
          {tc || "N/A"}
        </span>
      ),
    },
    {
      title: "Blood Type",
      dataIndex: "bloodType",
      key: "bloodType",
      width: 100,
      render: (bloodType) => (
        <Tag color="red" style={{ margin: 0 }}>
          {bloodType || "N/A"}
        </Tag>
      ),
    },
    {
      title: "Status",
      key: "status",
      width: 120,
      render: (_, record) => {
        const isVerified =
          record.isEmailConfirmed && record.isPhoneNumberConfirmed;
        return (
          <Badge
            status={isVerified ? "success" : "warning"}
            text={isVerified ? "Verified" : "Pending"}
          />
        );
      },
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
                Drivers & Employees
              </h1>
              <p
                style={{
                  color: "#8c8c8c",
                  fontSize: "16px",
                  marginTop: "8px",
                  margin: 0,
                }}
              >
                Manage your team members
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
              onClick={() => message.info("Add user functionality")}
            >
              Add User
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
                  placeholder="Search by name"
                  prefix={<SearchOutlined />}
                  value={filters.name}
                  onChange={(e) =>
                    setFilters({ ...filters, name: e.target.value })
                  }
                  size="large"
                  style={{ borderRadius: "8px" }}
                />
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Input
                  placeholder="Search by email"
                  prefix={<MailOutlined />}
                  value={filters.email}
                  onChange={(e) =>
                    setFilters({ ...filters, email: e.target.value })
                  }
                  size="large"
                  style={{ borderRadius: "8px" }}
                />
              </Col>
              <Col xs={24} sm={12} md={5}>
                <Select
                  placeholder="User Type"
                  value={filters.userType}
                  onChange={(value) =>
                    setFilters({ ...filters, userType: value })
                  }
                  style={{ width: "100%", borderRadius: "8px" }}
                  size="large"
                  allowClear
                >
                  <Option value={1}>Company Employee</Option>
                  <Option value={2}>Driver</Option>
                  <Option value={99}>System Admin</Option>
                </Select>
              </Col>
              <Col xs={24} sm={12} md={4}>
                <Select
                  placeholder="Verification"
                  value={filters.isEmailConfirmed}
                  onChange={(value) =>
                    setFilters({ ...filters, isEmailConfirmed: value })
                  }
                  style={{ width: "100%", borderRadius: "8px" }}
                  size="large"
                  allowClear
                >
                  <Option value={true}>Verified</Option>
                  <Option value={false}>Pending</Option>
                </Select>
              </Col>
              <Col xs={24} sm={12} md={3}>
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
              dataSource={users}
              loading={loading}
              pagination={{
                ...pagination,
                showSizeChanger: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} users`,
              }}
              onChange={(newPagination) => {
                fetchUsers(newPagination.current, newPagination.pageSize);
              }}
              rowKey="id"
              scroll={{ x: 1500 }}
            />
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Drivers;
