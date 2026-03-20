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
  message,
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
import { services } from "../../../common/services";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const truckIcon = new L.Icon({
  iconUrl:
    "data:image/svg+xml;base64," +
    btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
      <circle cx="12" cy="12" r="11" fill="#111111" stroke="white" stroke-width="2"/>
      <path d="M12 8l-4 4h3v4h2v-4h3z" fill="white"/>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

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
  const [currentLocation, setCurrentLocation] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const intervalRef = useRef(null);

  const fetchLoadLocation = async () => {
    if (!load?.id) return;

    try {
      setLoadingLocation(true);
      const response = await services.getLoadLocation(load.id);

      if (response.isSuccess && response.latitude && response.longitude) {
        setCurrentLocation({
          latitude: response.latitude,
          longitude: response.longitude,
        });
        setMapKey((prev) => prev + 1);
        setLastUpdate(new Date());
      }
    } catch (error) {
      console.error("Konum bilgisi alınamadı:", error);
    } finally {
      setLoadingLocation(false);
    }
  };

  useEffect(() => {
    if (visible && load?.id) {
      fetchLoadLocation();

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      intervalRef.current = setInterval(() => {
        fetchLoadLocation();
      }, 5000);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [visible, load?.id]);

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

  const locationData = currentLocation || {
    latitude: load.latitude,
    longitude: load.longitude,
  };

  const hasLocation = locationData?.latitude && locationData?.longitude;
  const mapCenter = hasLocation
    ? [parseFloat(locationData.latitude), parseFloat(locationData.longitude)]
    : [39.9334, 32.8597];

  return (
    <Modal
      title={
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "20px", fontWeight: "600" }}>
            Yük Detayları
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
        {/* Temel Bilgiler */}
        <Card
          title="Temel Bilgiler"
          style={{
            marginBottom: "24px",
            borderRadius: "12px",
            border: "1px solid #f0f0f0",
          }}
          headStyle={{ background: "#fafafa", fontWeight: "600" }}
        >
          <Descriptions column={{ xs: 1, sm: 2 }} bordered>
            <Descriptions.Item label="Başlık" span={2}>
              <strong>{load.title}</strong>
            </Descriptions.Item>
            {load.description && (
              <Descriptions.Item label="Açıklama" span={2}>
                {load.description}
              </Descriptions.Item>
            )}
            <Descriptions.Item label="Ağırlık">
              {load.weight ? `${load.weight} kg` : "—"}
            </Descriptions.Item>
            <Descriptions.Item label="Hacim">
              {load.volume ? `${load.volume} m³` : "—"}
            </Descriptions.Item>
            {load.totalDistanceKm && (
              <Descriptions.Item label="Toplam Mesafe" span={2}>
                {load.totalDistanceKm} km
              </Descriptions.Item>
            )}
          </Descriptions>
        </Card>

        {/* İletişim Bilgileri */}
        <Card
          title="İletişim Bilgileri"
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
                  <UserOutlined /> İletişim Kişisi
                </span>
              }
            >
              {load.contactPersonName || "—"}
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <span>
                  <PhoneOutlined /> Telefon
                </span>
              }
            >
              {load.contactPhone || "—"}
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <span>
                  <MailOutlined /> E-posta
                </span>
              }
              span={2}
            >
              {load.contactEmail || "—"}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Zaman Çizelgesi */}
        <Card
          title="Zaman Çizelgesi"
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
                    Oluşturulma
                  </div>
                  <div style={{ fontWeight: "500" }}>
                    {new Date(load.createdDate).toLocaleString("tr-TR")}
                  </div>
                </div>
              </div>
            </Col>
            {load.publishedAt && (
              <Col xs={24} sm={12}>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <CalendarOutlined style={{ color: "#555555" }} />
                  <div>
                    <div style={{ fontSize: "12px", color: "#8c8c8c" }}>
                      Yayınlanma
                    </div>
                    <div style={{ fontWeight: "500" }}>
                      {new Date(load.publishedAt).toLocaleString("tr-TR")}
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
                  <CalendarOutlined style={{ color: "#777777" }} />
                  <div>
                    <div style={{ fontSize: "12px", color: "#8c8c8c" }}>
                      Eşleştirilme
                    </div>
                    <div style={{ fontWeight: "500" }}>
                      {new Date(load.matchedAt).toLocaleString("tr-TR")}
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
                  <CalendarOutlined style={{ color: "#333333" }} />
                  <div>
                    <div style={{ fontSize: "12px", color: "#8c8c8c" }}>
                      Tamamlanma
                    </div>
                    <div style={{ fontWeight: "500" }}>
                      {new Date(load.completedAt).toLocaleString("tr-TR")}
                    </div>
                  </div>
                </div>
              </Col>
            )}
          </Row>
        </Card>

        {/* Güncel Konum Haritası */}
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
                <span>Güncel Konum</span>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "12px",
                    color: "#8c8c8c",
                  }}
                >
                  {loadingLocation ? (
                    <Spin size="small" />
                  ) : (
                    <ReloadOutlined spin />
                  )}
                  <span>
                    Otomatik güncelleme • Son güncelleme:{" "}
                    {lastUpdate.toLocaleTimeString("tr-TR")}
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
                background: "#f5f5f5",
                borderRadius: "8px",
              }}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <div style={{ fontSize: "12px", color: "#8c8c8c" }}>
                    Enlem
                  </div>
                  <div style={{ fontWeight: "600", color: "#111111" }}>
                    {locationData.latitude}
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ fontSize: "12px", color: "#8c8c8c" }}>
                    Boylam
                  </div>
                  <div style={{ fontWeight: "600", color: "#111111" }}>
                    {locationData.longitude}
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
                        <div>Enlem: {locationData.latitude}</div>
                        <div>Boylam: {locationData.longitude}</div>
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
                background: "#f5f5f5",
                borderRadius: "6px",
                fontSize: "12px",
                color: "#666666",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <EnvironmentOutlined />
              <span>
                Harita gerçek zamanlı konumu göstermek için 5 saniyede bir otomatik güncellenir
              </span>
            </div>
          </Card>
        )}

        {/* Yük Durakları */}
        <Card
          title={
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>Yük Durakları</span>
              <Tag
                style={{
                  border: "1px solid #e8e8e8",
                  background: "#f5f5f5",
                  color: "#595959",
                }}
              >
                {sortedStops.length} Durak
              </Tag>
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
            <Empty description="Durak eklenmemiş" />
          ) : (
            <Timeline
              items={sortedStops.map((stop, index) => ({
                dot: (
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      backgroundColor: "#f5f5f5",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#333333",
                      border: "2px solid #d9d9d9",
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
                        Durak {index + 1}
                      </strong>
                      <Tag
                        style={{
                          border: "1px solid #e8e8e8",
                          background: "#f5f5f5",
                          color: "#595959",
                        }}
                      >
                        {stop.stopType === 0 ? "Alış" : "Teslimat"}
                      </Tag>
                      {stop.completedAt && (
                        <Tag
                          style={{
                            border: "1px solid #e8e8e8",
                            background: "#f0f0f0",
                            color: "#333333",
                          }}
                        >
                          Tamamlandı{" "}
                          {new Date(stop.completedAt).toLocaleDateString("tr-TR")}
                        </Tag>
                      )}
                    </div>

                    <div style={{ color: "#595959", lineHeight: "1.8" }}>
                      <div>
                        <strong>Adres:</strong> {stop.address}
                      </div>
                      <div>
                        <strong>Konum:</strong> {stop.city}, {stop.district},{" "}
                        {stop.country}
                      </div>
                      {stop.contactPersonName && (
                        <div>
                          <strong>İletişim:</strong> {stop.contactPersonName}
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
