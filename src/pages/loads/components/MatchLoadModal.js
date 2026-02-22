import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Select,
  Button,
  message,
  Avatar,
  Tag,
  Space,
  Divider,
} from "antd";
import {
  UserOutlined,
  CarOutlined,
  MailOutlined,
  PhoneOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { services } from "../../../common/services";

const { Option } = Select;

const MatchLoadModal = ({ visible, load, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingVehicles, setLoadingVehicles] = useState(false);

  useEffect(() => {
    if (visible) {
      fetchUsers();
      form.resetFields();
      setSelectedUserId(null);
      setVehicles([]);
    }
  }, [visible]);

  useEffect(() => {
    if (selectedUserId) {
      fetchUserVehicles(selectedUserId);
    } else {
      setVehicles([]);
      form.setFieldValue("vehicleId", undefined);
    }
  }, [selectedUserId]);

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const response = await services.getUsersList({
        pageSize: 100,
        userType: 2, // Only drivers
      });
      setUsers(response || []);
    } catch (error) {
      message.error("Kullanıcılar yüklenirken hata oluştu");
      console.error("Error fetching users:", error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchUserVehicles = async (userId) => {
    try {
      setLoadingVehicles(true);
      const response = await services.getUserVehicles(userId);
      setVehicles(response || []);
    } catch (error) {
      message.error("Araçlar yüklenirken hata oluştu");
      console.error("Error fetching vehicles:", error);
    } finally {
      setLoadingVehicles(false);
    }
  };

  const handleUserChange = (userId) => {
    setSelectedUserId(userId);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const response = await services.matchLoad({
        loadId: load.id,
        userId: values.userId,
        vehicleId: values.vehicleId,
      });

      if (response.isSuccess) {
        message.success("Yük başarıyla eşleştirildi!");
        onSuccess();
        onClose();
      } else {
        message.error(response.message || "Eşleştirme başarısız");
      }
    } catch (error) {
      if (error.errorFields) {
        message.error("Lütfen tüm alanları doldurun");
      } else {
        message.error("Eşleştirme sırasında hata oluştu");
        console.error("Error matching load:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const getUserTypeTag = (type) => {
    const types = {
      1: { color: "blue", text: "Şirket Çalışanı" },
      2: { color: "green", text: "Şoför" },
      99: { color: "gold", text: "Sistem Yöneticisi" },
    };
    const config = types[type] || { color: "default", text: "Bilinmiyor" };
    return <Tag color={config.color}>{config.text}</Tag>;
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
      1: { color: "success", text: "Müsait" },
      2: { color: "warning", text: "Bakımda" },
      3: { color: "default", text: "Pasif" },
      4: { color: "error", text: "Hizmet Dışı" },
      5: { color: "processing", text: "Görevde" },
    };
    const config = statusConfig[status] || {
      color: "default",
      text: "Bilinmiyor",
    };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  return (
    <Modal
      title={
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
            }}
          >
            <CheckCircleOutlined style={{ fontSize: "20px" }} />
          </div>
          <div>
            <div style={{ fontSize: "18px", fontWeight: "600" }}>
              Yük Eşleştir
            </div>
            <div
              style={{
                fontSize: "12px",
                color: "#8c8c8c",
                fontWeight: "normal",
              }}
            >
              {load?.title}
            </div>
          </div>
        </div>
      }
      open={visible}
      onCancel={onClose}
      width={700}
      footer={[
        <Button key="cancel" onClick={onClose} style={{ borderRadius: "8px" }}>
          İptal
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleSubmit}
          style={{
            borderRadius: "8px",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            border: "none",
          }}
        >
          Eşleştir
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" style={{ marginTop: "24px" }}>
        <Form.Item
          name="userId"
          label={
            <span style={{ fontSize: "14px", fontWeight: "600" }}>
              Kullanıcı Seç
            </span>
          }
          rules={[{ required: true, message: "Lütfen bir kullanıcı seçin" }]}
        >
          <Select
            showSearch
            placeholder="Kullanıcı ara..."
            size="large"
            loading={loadingUsers}
            onChange={handleUserChange}
            filterOption={(input, option) => {
              const user = users.find((u) => u.id === option.value);
              if (!user) return false;
              const searchText = input.toLowerCase();
              return (
                user.name?.toLowerCase().includes(searchText) ||
                user.surname?.toLowerCase().includes(searchText) ||
                user.email?.toLowerCase().includes(searchText) ||
                user.userCode?.toLowerCase().includes(searchText)
              );
            }}
            style={{ borderRadius: "8px" }}
          >
            {users.map((user) => (
              <Option key={user.id} value={user.id}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "8px 0",
                  }}
                >
                  <Avatar
                    size={40}
                    style={{
                      backgroundColor: "#667eea",
                      color: "white",
                      fontWeight: "bold",
                    }}
                    src={user.profileImageUrl}
                  >
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </Avatar>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "4px",
                      }}
                    >
                      <span style={{ fontWeight: "600", fontSize: "14px" }}>
                        {user.name} {user.surname}
                      </span>
                      {getUserTypeTag(user.userType)}
                    </div>
                    <Space size="small" style={{ fontSize: "12px" }}>
                      <MailOutlined style={{ color: "#8c8c8c" }} />
                      <span style={{ color: "#8c8c8c" }}>{user.email}</span>
                      {user.phoneNumber && (
                        <>
                          <Divider type="vertical" />
                          <PhoneOutlined style={{ color: "#8c8c8c" }} />
                          <span style={{ color: "#8c8c8c" }}>
                            {user.phoneNumber}
                          </span>
                        </>
                      )}
                    </Space>
                  </div>
                </div>
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="vehicleId"
          label={
            <span style={{ fontSize: "14px", fontWeight: "600" }}>
              Araç Seç
            </span>
          }
          rules={[{ required: true, message: "Lütfen bir araç seçin" }]}
        >
          <Select
            showSearch
            placeholder={
              selectedUserId ? "Araç ara..." : "Önce bir kullanıcı seçin"
            }
            size="large"
            loading={loadingVehicles}
            disabled={!selectedUserId || vehicles.length === 0}
            filterOption={(input, option) => {
              const vehicle = vehicles.find((v) => v.id === option.value);
              if (!vehicle) return false;
              const searchText = input.toLowerCase();
              return (
                vehicle.plateNumber?.toLowerCase().includes(searchText) ||
                vehicle.make?.toLowerCase().includes(searchText) ||
                vehicle.model?.toLowerCase().includes(searchText)
              );
            }}
            style={{ borderRadius: "8px" }}
            notFoundContent={
              selectedUserId && !loadingVehicles ? (
                <div
                  style={{
                    padding: "20px",
                    textAlign: "center",
                    color: "#8c8c8c",
                  }}
                >
                  Bu kullanıcıya ait araç bulunamadı
                </div>
              ) : null
            }
          >
            {vehicles.map((vehicle) => (
              <Option key={vehicle.id} value={vehicle.id}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "8px 0",
                  }}
                >
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
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "4px",
                      }}
                    >
                      <span style={{ fontWeight: "600", fontSize: "14px" }}>
                        {vehicle.plateNumber}
                      </span>
                      {getVehicleStatusTag(vehicle.status)}
                    </div>
                    <Space size="small" style={{ fontSize: "12px" }}>
                      <span style={{ color: "#8c8c8c" }}>
                        {vehicle.make} {vehicle.model}
                      </span>
                      <Divider type="vertical" />
                      <Tag color="blue" style={{ margin: 0, fontSize: "11px" }}>
                        {getVehicleTypeText(vehicle.vehicleType)}
                      </Tag>
                      {vehicle.payloadCapacity && (
                        <>
                          <Divider type="vertical" />
                          <span style={{ color: "#8c8c8c" }}>
                            {vehicle.payloadCapacity} kg
                          </span>
                        </>
                      )}
                    </Space>
                  </div>
                </div>
              </Option>
            ))}
          </Select>
        </Form.Item>

        {selectedUserId && vehicles.length === 0 && !loadingVehicles && (
          <div
            style={{
              padding: "16px",
              background: "#fff7e6",
              border: "1px solid #ffd591",
              borderRadius: "8px",
              marginTop: "-8px",
            }}
          >
            <div style={{ color: "#fa8c16", fontSize: "14px" }}>
              ⚠️ Seçilen kullanıcıya ait araç bulunamadı. Lütfen farklı bir
              kullanıcı seçin.
            </div>
          </div>
        )}

        {load && (
          <div
            style={{
              marginTop: "24px",
              padding: "16px",
              background: "#f0f5ff",
              borderRadius: "8px",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                color: "#1890ff",
                fontWeight: "600",
                marginBottom: "8px",
              }}
            >
              Yük Bilgileri
            </div>
            <div style={{ fontSize: "13px", color: "#595959" }}>
              <div style={{ marginBottom: "4px" }}>
                <strong>Başlık:</strong> {load.title}
              </div>
              {load.weight && (
                <div style={{ marginBottom: "4px" }}>
                  <strong>Ağırlık:</strong> {load.weight} kg
                </div>
              )}
              {load.volume && (
                <div style={{ marginBottom: "4px" }}>
                  <strong>Hacim:</strong> {load.volume} m³
                </div>
              )}
              {load.loadStops && load.loadStops.length > 0 && (
                <div>
                  <strong>Durak Sayısı:</strong> {load.loadStops.length}
                </div>
              )}
            </div>
          </div>
        )}
      </Form>
    </Modal>
  );
};

export default MatchLoadModal;
