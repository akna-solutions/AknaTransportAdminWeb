import React, { useEffect, useRef, useState } from "react";
import {
  Modal,
  Descriptions,
  Timeline,
  Tag,
  Row,
  Col,
  Card,
  Empty,
  Spin,
} from "antd";
import {
  EnvironmentOutlined,
  CheckCircleOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  CalendarOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import LoadStatusTag from "./LoadStatusTag";

// Fix for default marker icon in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom truck icon
const truckIcon = new L.Icon({
  iconUrl:
    "data:image/svg+xml;base64," +
    btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
      <circle cx="12" cy="12" r="11" fill="#667eea" stroke="white" stroke-width="2"/>
      <path d="M12 8l-4 4h3v4h2v-4h3z" fill="white"/>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

// Component to handle map updates
const MapUpdater = ({ center }) => {
  const map = useMap();

  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);

  return null;
};

const LoadDetailsModal = ({ visible, load, onClose }) => {
  const [mapKey, setMapKey] = useState(0);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const intervalRef = useRef(null);

  useEffect(() => {
    if (visible && load?.latitude && load?.longitude) {
      // Clear any existing interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      // Set up auto-refresh every 5 seconds
      intervalRef.current = setInterval(() => {
        setMapKey((prev) => prev + 1);
        setLastUpdate(new Date());
      }, 5000);

      // Cleanup on unmount or when modal closes
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [visible, load]);

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

  const hasLocation = load.latitude && load.longitude;
  const mapCenter = hasLocation
    ? [parseFloat(load.latitude), parseFloat(load.longitude)]
    : [39.9334, 32.8597]; // Default to Ankara, Turkey

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

        {/* Current Location Map */}
        {hasLocation && (
          <Card
            title={
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>Current Location</span>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "12px",
                    color: "#8c8c8c",
                  }}
                >
                  <ReloadOutlined spin />
                  <span>
                    Auto-refresh • Last updated:{" "}
                    {lastUpdate.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            }
            style={{
              marginBottom: "24px",
              borderRadius: "12px",
              border: "1px solid #f0f0f0",
            }}
            headStyle={{ background: "#fafafa", fontWeight: "600" }}
          >
            <div
              style={{
                marginBottom: "16px",
                padding: "12px",
                background: "#f0f5ff",
                borderRadius: "8px",
              }}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <div style={{ fontSize: "12px", color: "#8c8c8c" }}>
                    Latitude
                  </div>
                  <div style={{ fontWeight: "600", color: "#1890ff" }}>
                    {load.latitude}
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ fontSize: "12px", color: "#8c8c8c" }}>
                    Longitude
                  </div>
                  <div style={{ fontWeight: "600", color: "#1890ff" }}>
                    {load.longitude}
                  </div>
                </Col>
              </Row>
            </div>

            <div
              style={{
                height: "400px",
                borderRadius: "8px",
                overflow: "hidden",
                border: "2px solid #f0f0f0",
              }}
            >
              <MapContainer
                key={mapKey}
                center={mapCenter}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
                scrollWheelZoom={true}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapUpdater center={mapCenter} />
                <Marker position={mapCenter} icon={truckIcon}>
                  <Popup>
                    <div style={{ textAlign: "center" }}>
                      <strong style={{ fontSize: "14px" }}>{load.title}</strong>
                      <div
                        style={{
                          marginTop: "8px",
                          fontSize: "12px",
                          color: "#595959",
                        }}
                      >
                        <div>Lat: {load.latitude}</div>
                        <div>Lng: {load.longitude}</div>
                      </div>
                      <div style={{ marginTop: "8px" }}>
                        <LoadStatusTag status={getLoadStatus()} />
                      </div>
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>
            </div>

            <div
              style={{
                marginTop: "12px",
                padding: "8px 12px",
                background: "#fff7e6",
                borderRadius: "6px",
                fontSize: "12px",
                color: "#faad14",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <EnvironmentOutlined />
              <span>
                Map auto-refreshes every 5 seconds to show real-time location
              </span>
            </div>
          </Card>
        )}

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
      </div>
    </Modal>
  );
};

export default LoadDetailsModal;
