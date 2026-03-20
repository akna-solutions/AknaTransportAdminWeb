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

      const mockUsers = [
        {
          id: 1,
          name: "Ahmet",
          surname: "Yılmaz",
          userCode: "AY001",
          email: "ahmet.yilmaz@example.com",
          phoneNumber: "+90 532 123 4567",
          userType: 1,
          gender: 1,
          isEmailConfirmed: true,
          isPhoneNumberConfirmed: true,
          profileImageUrl: null,
        },
        {
          id: 2,
          name: "Fatma",
          surname: "Demir",
          userCode: "FD002",
          email: "fatma.demir@example.com",
          phoneNumber: "+90 533 987 6543",
          userType: 1,
          gender: 2,
          isEmailConfirmed: true,
          isPhoneNumberConfirmed: false,
          profileImageUrl: null,
        },
        {
          id: 3,
          name: "Mehmet",
          surname: "Kaya",
          userCode: "MK003",
          email: "mehmet.kaya@example.com",
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
    } catch (error) {
      message.error("Kullanıcılar yüklenemedi");
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (userId, userName) => {
    confirm({
      title: "Kullanıcı Sil",
      icon: <ExclamationCircleOutlined />,
      content: `"${userName}" kullanıcısını silmek istediğinize emin misiniz?`,
      okText: "Evet, Sil",
      okType: "danger",
      cancelText: "İptal",
      onOk: async () => {
        try {
          await services.deleteUser(userId);
          message.success("Kullanıcı başarıyla silindi");
          fetchUsers(pagination.current, pagination.pageSize);
        } catch (error) {
          message.error("Kullanıcı silinemedi");
          console.error("Error deleting user:", error);
        }
      },
    });
  };

  const getUserTypeTag = (type) => {
    const types = {
      1: { text: "Sürücü" },
      2: { text: "Yönetici" },
      99: { text: "Süper Yönetici" },
    };

    const config = types[type] || { text: "Bilinmiyor" };
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

  const getGenderText = (gender) => {
    return gender === 1 ? "Erkek" : gender === 2 ? "Kadın" : "—";
  };

  const getActionItems = (record) => [
    {
      key: "view",
      icon: <EyeOutlined />,
      label: "Profili Gör",
      onClick: () => {
        message.info("Profil görüntüleme işlevi");
      },
    },
    {
      key: "edit",
      icon: <EditOutlined />,
      label: "Düzenle",
      onClick: () => {
        message.info("Kullanıcı düzenleme işlevi");
      },
    },
    {
      key: "delete",
      icon: <DeleteOutlined />,
      label: "Sil",
      danger: true,
      onClick: () =>
        handleDelete(record.id, `${record.name} ${record.surname}`),
    },
  ];

  const columns = [
    {
      title: "Kullanıcı",
      dataIndex: "name",
      key: "name",
      render: (name, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Avatar
            size={40}
            style={{
              backgroundColor: "#111111",
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
      title: "İletişim",
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
              <CheckCircleOutlined style={{ color: "#333333" }} />
            ) : (
              <CloseCircleOutlined style={{ color: "#999999" }} />
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
                <CheckCircleOutlined style={{ color: "#333333" }} />
              ) : (
                <CloseCircleOutlined style={{ color: "#999999" }} />
              )}
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Tür",
      dataIndex: "userType",
      key: "userType",
      render: (type) => getUserTypeTag(type),
    },
    {
      title: "Cinsiyet",
      dataIndex: "gender",
      key: "gender",
      render: (gender) => (
        <span style={{ color: "#8c8c8c", fontSize: "12px" }}>
          {getGenderText(gender)}
        </span>
      ),
    },
    {
      title: "Durum",
      key: "status",
      render: (_, record) => {
        const isVerified =
          record.isEmailConfirmed && record.isPhoneNumberConfirmed;
        return (
          <Badge
            status={isVerified ? "success" : "warning"}
            text={isVerified ? "Doğrulandı" : "Bekliyor"}
          />
        );
      },
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
            Son Kullanıcılar
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
        dataSource={users}
        loading={loading}
        pagination={{
          ...pagination,
          showSizeChanger: false,
          showQuickJumper: false,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} / ${total} kullanıcı`,
        }}
        onChange={handleTableChange}
        rowKey="id"
        size="middle"
      />
    </Card>
  );
};

export default UsersList;
