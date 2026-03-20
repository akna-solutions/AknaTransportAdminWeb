import React from "react";
import { Card, Descriptions, Tag, Timeline } from "antd";
import { EnvironmentOutlined, CheckCircleOutlined } from "@ant-design/icons";

const LoadSummaryStep = ({ form, loadStops }) => {
  const values =
    form.getFieldsValue([
      "title",
      "description",
      "weight",
      "volume",
      "contactPersonName",
      "contactPhone",
      "contactEmail",
    ]) || {};

  console.log("Summary Step - Form Values:", values);
  console.log("Summary Step - Load Stops:", loadStops);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Yük Bilgileri */}
      <Card
        title={
          <span style={{ fontSize: "18px", fontWeight: "600" }}>
            Yük Bilgileri
          </span>
        }
        style={{
          borderRadius: "16px",
          border: "1px solid #f0f0f0",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        }}
      >
        <Descriptions column={{ xs: 1, sm: 2 }} bordered>
          <Descriptions.Item label="Başlık" span={2}>
            <strong>{values.title || "—"}</strong>
          </Descriptions.Item>
          <Descriptions.Item label="Açıklama" span={2}>
            {values.description || "—"}
          </Descriptions.Item>
          <Descriptions.Item label="Ağırlık">
            {values.weight ? `${values.weight} kg` : "—"}
          </Descriptions.Item>
          <Descriptions.Item label="Hacim">
            {values.volume ? `${values.volume} m³` : "—"}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* İletişim Bilgileri */}
      <Card
        title={
          <span style={{ fontSize: "18px", fontWeight: "600" }}>
            İletişim Bilgileri
          </span>
        }
        style={{
          borderRadius: "16px",
          border: "1px solid #f0f0f0",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        }}
      >
        <Descriptions column={{ xs: 1, sm: 2 }} bordered>
          <Descriptions.Item label="İletişim Kişisi">
            {values.contactPersonName || "—"}
          </Descriptions.Item>
          <Descriptions.Item label="Telefon">
            {values.contactPhone || "—"}
          </Descriptions.Item>
          <Descriptions.Item label="E-posta" span={2}>
            {values.contactEmail || "—"}
          </Descriptions.Item>
        </Descriptions>
      </Card>

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
            <span style={{ fontSize: "18px", fontWeight: "600" }}>
              Yük Durakları
            </span>
            <Tag
              style={{
                border: "1px solid #e8e8e8",
                background: "#f5f5f5",
                color: "#595959",
              }}
            >
              {loadStops?.length || 0} Durak
            </Tag>
          </div>
        }
        style={{
          borderRadius: "16px",
          border: "1px solid #f0f0f0",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        }}
      >
        {!loadStops || loadStops.length === 0 ? (
          <div
            style={{ textAlign: "center", padding: "40px", color: "#8c8c8c" }}
          >
            Durak eklenmedi
          </div>
        ) : (
          <Timeline
            items={loadStops.map((stop, index) => ({
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
                  </div>

                  <div style={{ color: "#595959", lineHeight: "1.8" }}>
                    <div>
                      <strong>Adres:</strong> {stop.address || "—"}
                    </div>
                    <div>
                      <strong>Konum:</strong> {stop.city || "—"},{" "}
                      {stop.district || "—"}, {stop.country || "Türkiye"}
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

      {/* Özet İstatistikler */}
      <Card
        style={{
          borderRadius: "16px",
          border: "1px solid #e8e8e8",
          background: "#f5f5f5",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            flexWrap: "wrap",
            gap: "24px",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{ fontSize: "24px", fontWeight: "bold", color: "#111111" }}
            >
              {loadStops?.filter((s) => s.stopType === 0).length || 0}
            </div>
            <div style={{ color: "#8c8c8c", marginTop: "4px" }}>
              Alış Noktası
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div
              style={{ fontSize: "24px", fontWeight: "bold", color: "#444444" }}
            >
              {loadStops?.filter((s) => s.stopType === 1).length || 0}
            </div>
            <div style={{ color: "#8c8c8c", marginTop: "4px" }}>
              Teslimat Noktası
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div
              style={{ fontSize: "24px", fontWeight: "bold", color: "#777777" }}
            >
              {loadStops?.length || 0}
            </div>
            <div style={{ color: "#8c8c8c", marginTop: "4px" }}>
              Toplam Durak
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default LoadSummaryStep;
