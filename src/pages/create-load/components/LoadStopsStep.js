import React, { useState } from "react";
import {
  Card,
  Button,
  List,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  Row,
  Col,
  Space,
  Empty,
  Alert,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EnvironmentOutlined,
  UpOutlined,
  DownOutlined,
  WarningOutlined,
} from "@ant-design/icons";

const { Option } = Select;

const LoadStopsStep = ({ loadStops, setLoadStops, form }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingStop, setEditingStop] = useState(null);
  const [stopForm] = Form.useForm();

  const pickupCount = loadStops.filter((stop) => stop.stopType === 0).length;
  const deliveryCount = loadStops.filter((stop) => stop.stopType === 1).length;

  const handleAddStop = () => {
    setEditingStop(null);
    stopForm.resetFields();

    if (pickupCount === 0) {
      stopForm.setFieldsValue({ stopType: 0 });
    }

    setIsModalVisible(true);
  };

  const handleEditStop = (stop, index) => {
    setEditingStop({ ...stop, index });
    stopForm.setFieldsValue(stop);
    setIsModalVisible(true);
  };

  const handleDeleteStop = (index) => {
    const newStops = loadStops.filter((_, i) => i !== index);
    setLoadStops(newStops);
  };

  const handleMoveUp = (index) => {
    if (index === 0) return;
    const newStops = [...loadStops];
    [newStops[index - 1], newStops[index]] = [
      newStops[index],
      newStops[index - 1],
    ];
    setLoadStops(newStops);
  };

  const handleMoveDown = (index) => {
    if (index === loadStops.length - 1) return;
    const newStops = [...loadStops];
    [newStops[index], newStops[index + 1]] = [
      newStops[index + 1],
      newStops[index],
    ];
    setLoadStops(newStops);
  };

  const handleSaveStop = async () => {
    try {
      const values = await stopForm.validateFields();

      if (pickupCount === 0 && values.stopType === 1 && editingStop === null) {
        Modal.error({
          title: "Alış Durağı Gerekli",
          content:
            "Teslimat durağı eklemeden önce en az bir alış durağı eklemelisiniz.",
        });
        return;
      }

      if (editingStop !== null && editingStop.index !== undefined) {
        const newStops = [...loadStops];
        newStops[editingStop.index] = values;
        setLoadStops(newStops);
      } else {
        setLoadStops([...loadStops, values]);
      }

      setIsModalVisible(false);
      stopForm.resetFields();
    } catch (error) {
      console.error("Validation error:", error);
    }
  };

  const getStopTypeTag = (type) => {
    return type === 0 ? (
      <Tag
        style={{
          border: "1px solid #d9d9d9",
          background: "#f5f5f5",
          color: "#595959",
        }}
      >
        Alış
      </Tag>
    ) : (
      <Tag
        style={{
          border: "1px solid #d9d9d9",
          background: "#f0f0f0",
          color: "#595959",
        }}
      >
        Teslimat
      </Tag>
    );
  };

  return (
    <>
      <Card
        style={{
          borderRadius: "16px",
          border: "1px solid #f0f0f0",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <div>
            <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "600" }}>
              Yük Durakları
            </h3>
            <p
              style={{
                margin: "4px 0 0 0",
                color: "#8c8c8c",
                fontSize: "14px",
              }}
            >
              Alış ve teslimat noktalarını ekleyin
            </p>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddStop}
            style={{
              borderRadius: "8px",
              background: "#111111",
              border: "none",
            }}
          >
            Durak Ekle
          </Button>
        </div>

        {pickupCount === 0 && loadStops.length > 0 && (
          <Alert
            message="En az bir alış durağı eklemelisiniz"
            description="Teslimat durağı eklemeden önce yük alma noktası belirlemeniz gerekmektedir."
            type="warning"
            icon={<WarningOutlined />}
            showIcon
            style={{ marginBottom: "16px" }}
          />
        )}

        {loadStops.length > 0 && (
          <div
            style={{
              padding: "12px 16px",
              background: "#f5f5f5",
              borderRadius: "8px",
              marginBottom: "16px",
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  color: "#111111",
                }}
              >
                {pickupCount}
              </div>
              <div style={{ fontSize: "12px", color: "#8c8c8c" }}>Alış</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  color: "#444444",
                }}
              >
                {deliveryCount}
              </div>
              <div style={{ fontSize: "12px", color: "#8c8c8c" }}>Teslimat</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  color: "#777777",
                }}
              >
                {loadStops.length}
              </div>
              <div style={{ fontSize: "12px", color: "#8c8c8c" }}>Toplam</div>
            </div>
          </div>
        )}

        {loadStops.length === 0 ? (
          <Empty
            description="Henüz durak eklenmedi"
            style={{ padding: "40px 0" }}
          />
        ) : (
          <List
            dataSource={loadStops}
            renderItem={(stop, index) => (
              <List.Item
                style={{
                  padding: "16px",
                  background: "#fafafa",
                  borderRadius: "8px",
                  marginBottom: "12px",
                }}
                actions={[
                  <Button
                    icon={<UpOutlined />}
                    size="small"
                    disabled={index === 0}
                    onClick={() => handleMoveUp(index)}
                  />,
                  <Button
                    icon={<DownOutlined />}
                    size="small"
                    disabled={index === loadStops.length - 1}
                    onClick={() => handleMoveDown(index)}
                  />,
                  <Button
                    icon={<EditOutlined />}
                    size="small"
                    onClick={() => handleEditStop(stop, index)}
                  />,
                  <Button
                    icon={<DeleteOutlined />}
                    size="small"
                    danger
                    onClick={() => handleDeleteStop(index)}
                  />,
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        background: "#f5f5f5",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#333333",
                      }}
                    >
                      <EnvironmentOutlined style={{ fontSize: "18px" }} />
                    </div>
                  }
                  title={
                    <Space>
                      <span style={{ fontWeight: "600" }}>
                        Durak {index + 1}
                      </span>
                      {getStopTypeTag(stop.stopType)}
                    </Space>
                  }
                  description={
                    <div>
                      <div style={{ marginTop: "4px" }}>
                        <strong>Adres:</strong> {stop.address}
                      </div>
                      <div style={{ marginTop: "4px" }}>
                        <strong>Şehir:</strong> {stop.city}, {stop.district}
                      </div>
                      {stop.contactPersonName && (
                        <div style={{ marginTop: "4px" }}>
                          <strong>İletişim:</strong> {stop.contactPersonName}
                          {stop.contactPhone && ` - ${stop.contactPhone}`}
                        </div>
                      )}
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Card>

      <Modal
        title={editingStop !== null ? "Durağı Düzenle" : "Yeni Durak Ekle"}
        open={isModalVisible}
        onOk={handleSaveStop}
        onCancel={() => {
          setIsModalVisible(false);
          stopForm.resetFields();
        }}
        width={700}
        okText="Kaydet"
        cancelText="İptal"
        okButtonProps={{
          style: {
            borderRadius: "8px",
            background: "#111111",
            border: "none",
          },
        }}
        cancelButtonProps={{
          style: { borderRadius: "8px" },
        }}
      >
        <Form form={stopForm} layout="vertical" style={{ marginTop: "24px" }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Form.Item
                name="stopType"
                label="Durak Türü"
                rules={[{ required: true, message: "Lütfen durak türü seçin" }]}
              >
                <Select
                  placeholder="Tür seçin"
                  size="large"
                  style={{ borderRadius: "8px" }}
                  disabled={pickupCount === 0 && editingStop === null}
                >
                  <Option value={0}>Alış</Option>
                  <Option
                    value={1}
                    disabled={pickupCount === 0 && editingStop === null}
                  >
                    Teslimat {pickupCount === 0 && "(Önce Alış Ekleyin)"}
                  </Option>
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item
                name="address"
                label="Adres"
                rules={[
                  { required: true, message: "Lütfen adres girin" },
                  { max: 500, message: "Adres 500 karakteri geçemez" },
                ]}
              >
                <Input.TextArea
                  rows={2}
                  placeholder="Tam adres"
                  style={{ borderRadius: "8px" }}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="city"
                label="Şehir"
                rules={[
                  { required: true, message: "Lütfen şehir girin" },
                  { max: 100, message: "Şehir 100 karakteri geçemez" },
                ]}
              >
                <Input
                  placeholder="Örn: İstanbul"
                  size="large"
                  style={{ borderRadius: "8px" }}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="district"
                label="İlçe"
                rules={[
                  { required: true, message: "Lütfen ilçe girin" },
                  {
                    max: 100,
                    message: "İlçe 100 karakteri geçemez",
                  },
                ]}
              >
                <Input
                  placeholder="Örn: Kadıköy"
                  size="large"
                  style={{ borderRadius: "8px" }}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="contactPersonName"
                label="İletişim Kişisi"
                rules={[
                  { max: 100, message: "İsim 100 karakteri geçemez" },
                ]}
              >
                <Input
                  placeholder="İletişim adı"
                  size="large"
                  style={{ borderRadius: "8px" }}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="contactPhone"
                label="İletişim Telefonu"
                rules={[
                  { max: 20, message: "Telefon 20 karakteri geçemez" },
                ]}
              >
                <Input
                  placeholder="+90 532 123 4567"
                  size="large"
                  style={{ borderRadius: "8px" }}
                />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item
                name="country"
                label="Ülke"
                initialValue="Türkiye"
                rules={[
                  { max: 100, message: "Ülke 100 karakteri geçemez" },
                ]}
              >
                <Input size="large" style={{ borderRadius: "8px" }} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default LoadStopsStep;
