import React from "react";
import {
  Modal,
  Descriptions,
  Timeline,
  Tag,
  Divider,
  Row,
  Col,
  Card,
  Empty,
} from "antd";
import {
  EnvironmentOutlined,
  CheckCircleOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import LoadStatusTag from "./LoadStatusTag";

const LoadDetailsModal = ({ visible, load, onClose }) => {
  if (!load) {
    return null;
  }

  const getLoadStatus = () => {
    if (load.completedAt) return "completed";
    if (load.matchedAt) return "matched";
    if (load.publishedAt) return "published";
    return "draft";
  };

  const sortedStops = load.loadStops
    ? [...load.loadStops].sort((a, b) => a.stopOrder - b.stopOrder)
    : [];

  return (
    <Modal
      title={
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "20px", fontWeight: "600" }}>
            Load Details
          </span>
          <LoadStatusTag status={getLoadStatus()} />
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={900}
      style={{ top: 20 }}
    >
      <div style={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}>
        {/* Basic Information */}
        <Card
          title="Basic Information"
          style={{
            marginBottom: "24px",
            borderRadius: "12px",
            border: "1px solid #f0f0f0",
          }}
          headStyle={{ background: "#fafafa", fontWeight: "600" }}
        >
          <Descriptions column={{ xs: 1, sm: 2 }} bordered>
            <Descriptions.Item label="Title" span={2}>
              <strong>{load.title}</strong>
            </Descriptions.Item>
            {load.description && (
              <Descriptions.Item label="Description" span={2}>
                {load.description}
              </Descriptions.Item>
            )}
            <Descriptions.Item label="Weight">
              {load.weight ? `${load.weight} kg` : "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Volume">
              {load.volume ? `${load.volume} m³` : "N/A"}
            </Descriptions.Item>
            {load.totalDistanceKm && (
              <Descriptions.Item label="Total Distance" span={2}>
                {load.totalDistanceKm} km
              </Descriptions.Item>
            )}
          </Descriptions>
        </Card>

        {/* Contact Information */}
        <Card
          title="Contact Information"
          style={{
            marginBottom: "24px",
            borderRadius: "12px",
            border: "1px solid #f0f0f0",
          }}
          headStyle={{ background: "#fafafa", fontWeight: "600" }}
        >
          <Descriptions column={{ xs: 1, sm: 2 }} bordered>
            <Descriptions.Item
              label={
                <span>
                  <UserOutlined /> Contact Person
                </span>
              }
            >
              {load.contactPersonName || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <span>
                  <PhoneOutlined /> Phone
                </span>
              }
            >
              {load.contactPhone || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <span>
                  <MailOutlined /> Email
                </span>
              }
              span={2}
            >
              {load.contactEmail || "N/A"}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Timeline Information */}
        <Card
          title="Timeline"
          style={{
            marginBottom: "24px",
            borderRadius: "12px",
            border: "1px solid #f0f0f0",
          }}
          headStyle={{ background: "#fafafa", fontWeight: "600" }}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <CalendarOutlined style={{ color: "#8c8c8c" }} />
                <div>
                  <div style={{ fontSize: "12px", color: "#8c8c8c" }}>
                    Created
                  </div>
                  <div style={{ fontWeight: "500" }}>
                    {new Date(load.createdDate).toLocaleString()}
                  </div>
                </div>
              </div>
            </Col>
            {load.publishedAt && (
              <Col xs={24} sm={12}>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <CalendarOutlined style={{ color: "#1890ff" }} />
                  <div>
                    <div style={{ fontSize: "12px", color: "#8c8c8c" }}>
                      Published
                    </div>
                    <div style={{ fontWeight: "500" }}>
                      {new Date(load.publishedAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              </Col>
            )}
            {load.matchedAt && (
              <Col xs={24} sm={12}>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <CalendarOutlined style={{ color: "#faad14" }} />
                  <div>
                    <div style={{ fontSize: "12px", color: "#8c8c8c" }}>
                      Matched
                    </div>
                    <div style={{ fontWeight: "500" }}>
                      {new Date(load.matchedAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              </Col>
            )}
            {load.completedAt && (
              <Col xs={24} sm={12}>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <CalendarOutlined style={{ color: "#52c41a" }} />
                  <div>
                    <div style={{ fontSize: "12px", color: "#8c8c8c" }}>
                      Completed
                    </div>
                    <div style={{ fontWeight: "500" }}>
                      {new Date(load.completedAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              </Col>
            )}
          </Row>
        </Card>

        {/* Load Stops */}
        <Card
          title={
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>Load Stops</span>
              <Tag color="blue">{sortedStops.length} Stops</Tag>
            </div>
          }
          style={{
            marginBottom: "24px",
            borderRadius: "12px",
            border: "1px solid #f0f0f0",
          }}
          headStyle={{ background: "#fafafa", fontWeight: "600" }}
        >
          {sortedStops.length === 0 ? (
            <Empty description="No stops added" />
          ) : (
            <Timeline
              items={sortedStops.map((stop, index) => ({
                dot: (
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      backgroundColor:
                        stop.stopType === 0 ? "#1890ff15" : "#52c41a15",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: stop.stopType === 0 ? "#1890ff" : "#52c41a",
                      border: `2px solid ${
                        stop.stopType === 0 ? "#1890ff" : "#52c41a"
                      }`,
                    }}
                  >
                    {stop.stopType === 0 ? (
                      <EnvironmentOutlined />
                    ) : (
                      <CheckCircleOutlined />
                    )}
                  </div>
                ),
                children: (
                  <div style={{ marginLeft: "16px", marginBottom: "24px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "8px",
                      }}
                    >
                      <strong style={{ fontSize: "16px" }}>
                        Stop {index + 1}
                      </strong>
                      <Tag color={stop.stopType === 0 ? "blue" : "green"}>
                        {stop.stopType === 0 ? "Pickup" : "Delivery"}
                      </Tag>
                      {stop.completedAt && (
                        <Tag color="success">
                          Completed{" "}
                          {new Date(stop.completedAt).toLocaleDateString()}
                        </Tag>
                      )}
                    </div>

                    <div style={{ color: "#595959", lineHeight: "1.8" }}>
                      <div>
                        <strong>Address:</strong> {stop.address}
                      </div>
                      <div>
                        <strong>Location:</strong> {stop.city}, {stop.district},{" "}
                        {stop.country}
                      </div>
                      {stop.contactPersonName && (
                        <div>
                          <strong>Contact:</strong> {stop.contactPersonName}
                          {stop.contactPhone && ` - ${stop.contactPhone}`}
                        </div>
                      )}
                    </div>
                  </div>
                ),
              }))}
            />
          )}
        </Card>

        {/* Location Information */}
        {(load.latitude || load.longitude) && (
          <Card
            title="Current Location"
            style={{
              borderRadius: "12px",
              border: "1px solid #f0f0f0",
            }}
            headStyle={{ background: "#fafafa", fontWeight: "600" }}
          >
            <Descriptions column={2} bordered>
              <Descriptions.Item label="Latitude">
                {load.latitude || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Longitude">
                {load.longitude || "N/A"}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        )}
      </div>
    </Modal>
  );
};

export default LoadDetailsModal;
