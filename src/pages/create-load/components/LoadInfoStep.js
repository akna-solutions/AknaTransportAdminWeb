import React from "react";
import { Card, Form, Input, InputNumber, Row, Col } from "antd";

const { TextArea } = Input;

const LoadInfoStep = ({ form }) => {
  return (
    <Card
      style={{
        borderRadius: "16px",
        border: "1px solid #f0f0f0",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      }}
    >
      <Row gutter={[24, 24]}>
        <Col xs={24}>
          <Form.Item
            name="title"
            label="Load Title"
            rules={[
              { required: true, message: "Please enter load title" },
              { max: 200, message: "Title cannot exceed 200 characters" },
            ]}
          >
            <Input
              placeholder="e.g., Istanbul to Ankara Cargo"
              size="large"
              style={{ borderRadius: "8px" }}
            />
          </Form.Item>
        </Col>

        <Col xs={24}>
          <Form.Item
            name="description"
            label="Description"
            rules={[
              { max: 1000, message: "Description cannot exceed 1000 characters" },
            ]}
          >
            <TextArea
              rows={4}
              placeholder="Provide additional details about the load..."
              style={{ borderRadius: "8px" }}
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            name="weight"
            label="Weight (kg)"
            rules={[
              { type: "number", min: 0, message: "Weight must be positive" },
            ]}
          >
            <InputNumber
              placeholder="0"
              min={0}
              max={999999}
              style={{ width: "100%", borderRadius: "8px" }}
              size="large"
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            name="volume"
            label="Volume (m³)"
            rules={[
              { type: "number", min: 0, message: "Volume must be positive" },
            ]}
          >
            <InputNumber
              placeholder="0"
              min={0}
              max={999999}
              style={{ width: "100%", borderRadius: "8px" }}
              size="large"
            />
          </Form.Item>
        </Col>

        <Col xs={24}>
          <div
            style={{
              background: "#f0f5ff",
              padding: "16px",
              borderRadius: "8px",
              marginBottom: "16px",
            }}
          >
            <h4 style={{ margin: "0 0 12px 0", color: "#1890ff" }}>
              Contact Information
            </h4>
            <p style={{ margin: 0, color: "#595959", fontSize: "14px" }}>
              Provide contact details for this load
            </p>
          </div>
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
              placeholder="John Doe"
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
              {
                pattern: /^[0-9+\-() ]*$/,
                message: "Invalid phone number format",
              },
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
            name="contactEmail"
            label="Contact Email"
            rules={[
              { type: "email", message: "Please enter a valid email" },
              { max: 100, message: "Email cannot exceed 100 characters" },
            ]}
          >
            <Input
              placeholder="contact@example.com"
              size="large"
              style={{ borderRadius: "8px" }}
            />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );
};

export default LoadInfoStep;
