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
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EnvironmentOutlined,
  UpOutlined,
  DownOutlined,
} from "@ant-design/icons";

const { Option } = Select;

const LoadStopsStep = ({ loadStops, setLoadStops, form }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingStop, setEditingStop] = useState(null);
  const [stopForm] = Form.useForm();

  const handleAddStop = () => {
    setEditingStop(null);
    stopForm.resetFields();
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

      if (editingStop !== null && editingStop.index !== undefined) {
        // Edit existing stop
        const newStops = [...loadStops];
        newStops[editingStop.index] = values;
        setLoadStops(newStops);
      } else {
        // Add new stop
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
      <Tag color="blue">Pickup</Tag>
    ) : (
      <Tag color="green">Delivery</Tag>
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
              Load Stops
            </h3>
            <p style={{ margin: "4px 0 0 0", color: "#8c8c8c", fontSize: "14px" }}>
              Add pickup and delivery locations
            </p>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddStop}
            style={{
              borderRadius: "8px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              border: "none",
            }}
          >
            Add Stop
          </Button>
        </div>

        {loadStops.length === 0 ? (
          <Empty
            description="No stops added yet"
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
                        background:
                          stop.stopType === 0 ? "#1890ff15" : "#52c41a15",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: stop.stopType === 0 ? "#1890ff" : "#52c41a",
                      }}
                    >
                      <EnvironmentOutlined style={{ fontSize: "18px" }} />
                    </div>
                  }
                  title={
                    <Space>
                      <span style={{ fontWeight: "600" }}>
                        Stop {index + 1}
                      </span>
                      {getStopTypeTag(stop.stopType)}
                    </Space>
                  }
                  description={
                    <div>
                      <div style={{ marginTop: "4px" }}>
                        <strong>Address:</strong> {stop.address}
                      </div>
                      <div style={{ marginTop: "4px" }}>
                        <strong>City:</strong> {stop.city}, {stop.district}
                      </div>
                      {stop.contactPersonName && (
                        <div style={{ marginTop: "4px" }}>
                          <strong>Contact:</strong> {stop.contactPersonName}
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
        title={editingStop !== null ? "Edit Stop" : "Add New Stop"}
        open={isModalVisible}
        onOk={handleSaveStop}
        onCancel={() => setIsModalVisible(false)}
        width={700}
        okText="Save"
        cancelText="Cancel"
        okButtonProps={{
          style: {
            borderRadius: "8px",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
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
                label="Stop Type"
                rules={[{ required: true, message: "Please select stop type" }]}
              >
                <Select
                  placeholder="Select type"
                  size="large"
                  style={{ borderRadius: "8px" }}
                >
                  <Option value={0}>Pickup</Option>
                  <Option value={1}>Delivery</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item
                name="address"
                label="Address"
                rules={[
                  { required: true, message: "Please enter address" },
                  { max: 500, message: "Address cannot exceed 500 characters" },
                ]}
              >
                <Input.TextArea
                  rows={2}
                  placeholder="Full address"
                  style={{ borderRadius: "8px" }}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="city"
                label="City"
                rules={[
                  { required: true, message: "Please enter city" },
                  { max: 100, message: "City cannot exceed 100 characters" },
                ]}
              >
                <Input
                  placeholder="e.g., Istanbul"
                  size="large"
                  style={{ borderRadius: "8px" }}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="district"
                label="District"
                rules={[
                  { required: true, message: "Please enter district" },
                  { max: 100, message: "District cannot exceed 100 characters" },
                ]}
              >
                <Input
                  placeholder="e.g., Kadıköy"
                  size="large"
                  style={{ borderRadius: "8px" }}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="contactPersonName"
                label="Contact Person"
                rules={[
                  { max: 100, message: "Name cannot exceed 100 characters" },
                ]}
              >
                <Input
                  placeholder="Contact name"
                  size="large"
                  style={{ borderRadius: "8px" }}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="contactPhone"
                label="Contact Phone"
                rules={[
                  { max: 20, message: "Phone cannot exceed 20 characters" },
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
                label="Country"
                initialValue="Türkiye"
                rules={[
                  { max: 100, message: "Country cannot exceed 100 characters" },
                ]}
              >
                <Input
                  size="large"
                  style={{ borderRadius: "8px" }}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default LoadStopsStep;
