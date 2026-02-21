import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Tag,
  Button,
  Avatar,
  message,
  Modal,
  Dropdown,
  Badge,
} from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  ExclamationCircleOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { services } from "../../../common/services";

const { confirm } = Modal;

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async (page = 1, pageSize = 5, filters = {}) => {
    try {
      setLoading(true);

      // Mock data for users - replace with actual API call when ready
      const mockUsers = [
        {
          id: 1,
          name: "John",
          surname: "Doe",
          userCode: "JD001",
          email: "john.doe@example.com",
          phoneNumber: "+90 532 123 4567",
          userType: 1,
          gender: 1,
          isEmailConfirmed: true,
          isPhoneNumberConfirmed: true,
          profileImageUrl: null,
        },
        {
          id: 2,
          name: "Sarah",
          surname: "Wilson",
          userCode: "SW002",
          email: "sarah.wilson@example.com",
          phoneNumber: "+90 533 987 6543",
          userType: 1,
          gender: 2,
          isEmailConfirmed: true,
          isPhoneNumberConfirmed: false,
          profileImageUrl: null,
        },
        {
          id: 3,
          name: "Michael",
          surname: "Johnson",
          userCode: "MJ003",
          email: "michael.johnson@example.com",
          phoneNumber: "+90 534 555 7890",
          userType: 2,
          gender: 1,
          isEmailConfirmed: false,
          isPhoneNumberConfirmed: true,
          profileImageUrl: null,
        },
      ];

      setUsers(mockUsers);
      setPagination((prev) => ({
        ...prev,
        current: page,
        pageSize: pageSize,
        total: mockUsers.length,
      }));

      // Uncomment below to use actual API
      // const response = await services.getUsersList({
      //   page,
      //   pageSize,
      //   ...filters
      // });
      // setUsers(response || []);
      // setPagination(prev => ({
      //   ...prev,
      //   current: page,
      //   pageSize: pageSize,
      //   total: response?.length || 0
      // }));
    } catch (error) {
      message.error("Failed to load users");
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
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
          console.error("Error deleting user:", error);
        }
      },
    });
  };

  const getUserTypeTag = (type) => {
    const types = {
      1: { color: "blue", text: "Driver" },
      2: { color: "green", text: "Admin" },
      99: { color: "gold", text: "Super Admin" },
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
      onClick: () => {
        message.info("View user profile functionality");
      },
    },
    {
      key: "edit",
      icon: <EditOutlined />,
      label: "Edit User",
      onClick: () => {
        message.info("Edit user functionality");
      },
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
      render: (name, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Avatar
            size={40}
            style={{
              backgroundColor: "#667eea",
              color: "white",
              fontWeight: "bold",
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
      render: (_, record) => (
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "12px",
              marginBottom: "4px",
            }}
          >
            <MailOutlined style={{ color: "#8c8c8c" }} />
            <span>{record.email}</span>
            {record.isEmailConfirmed ? (
              <CheckCircleOutlined style={{ color: "#52c41a" }} />
            ) : (
              <CloseCircleOutlined style={{ color: "#ff4d4f" }} />
            )}
          </div>
          {record.phoneNumber && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "12px",
                color: "#8c8c8c",
              }}
            >
              <PhoneOutlined />
              <span>{record.phoneNumber}</span>
              {record.isPhoneNumberConfirmed ? (
                <CheckCircleOutlined style={{ color: "#52c41a" }} />
              ) : (
                <CloseCircleOutlined style={{ color: "#ff4d4f" }} />
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
      render: (type) => getUserTypeTag(type),
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      render: (gender) => (
        <span style={{ color: "#8c8c8c", fontSize: "12px" }}>
          {getGenderText(gender)}
        </span>
      ),
    },
    {
      title: "Status",
      key: "status",
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
    fetchUsers(pagination.current, pagination.pageSize);
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
            Recent Users
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
        dataSource={users}
        loading={loading}
        pagination={{
          ...pagination,
          showSizeChanger: false,
          showQuickJumper: false,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} users`,
        }}
        onChange={handleTableChange}
        rowKey="id"
        size="middle"
      />
    </Card>
  );
};

export default UsersList;
