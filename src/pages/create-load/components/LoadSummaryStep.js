// src/pages/create-load/components/LoadSummaryStep.js
import React from "react";
import { Card, Descriptions, Tag, Timeline } from "antd";
import { EnvironmentOutlined, CheckCircleOutlined } from "@ant-design/icons";

const LoadSummaryStep = ({ form, loadStops }) => {
  // Form değerlerini doğru şekilde al - tüm alanları açıkça belirt
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

  // Debug için
  console.log("Summary Step - Form Values:", values);
  console.log("Summary Step - Load Stops:", loadStops);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Load Information */}
      <Card
        title={
          <span style={{ fontSize: "18px", fontWeight: "600" }}>
            Load Information
          </span>
        }
        style={{
          borderRadius: "16px",
          border: "1px solid #f0f0f0",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        }}
      >
        <Descriptions column={{ xs: 1, sm: 2 }} bordered>
          <Descriptions.Item label="Title" span={2}>
            <strong>{values.title || "N/A"}</strong>
          </Descriptions.Item>
          <Descriptions.Item label="Description" span={2}>
            {values.description || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Weight">
            {values.weight ? `${values.weight} kg` : "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Volume">
            {values.volume ? `${values.volume} m³` : "N/A"}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Contact Information */}
      <Card
        title={
          <span style={{ fontSize: "18px", fontWeight: "600" }}>
            Contact Information
          </span>
        }
        style={{
          borderRadius: "16px",
          border: "1px solid #f0f0f0",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        }}
      >
        <Descriptions column={{ xs: 1, sm: 2 }} bordered>
          <Descriptions.Item label="Contact Person">
            {values.contactPersonName || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Phone">
            {values.contactPhone || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Email" span={2}>
            {values.contactEmail || "N/A"}
          </Descriptions.Item>
        </Descriptions>
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
            <span style={{ fontSize: "18px", fontWeight: "600" }}>
              Load Stops
            </span>
            <Tag color="blue">{loadStops?.length || 0} Stops</Tag>
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
            No stops added
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
                  </div>

                  <div style={{ color: "#595959", lineHeight: "1.8" }}>
                    <div>
                      <strong>Address:</strong> {stop.address || "N/A"}
                    </div>
                    <div>
                      <strong>Location:</strong> {stop.city || "N/A"},{" "}
                      {stop.district || "N/A"}, {stop.country || "Türkiye"}
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

      {/* Summary Stats */}
      <Card
        style={{
          borderRadius: "16px",
          border: "1px solid #f0f5ff",
          background: "#f0f5ff",
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
              style={{ fontSize: "24px", fontWeight: "bold", color: "#1890ff" }}
            >
              {loadStops?.filter((s) => s.stopType === 0).length || 0}
            </div>
            <div style={{ color: "#8c8c8c", marginTop: "4px" }}>
              Pickup Points
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div
              style={{ fontSize: "24px", fontWeight: "bold", color: "#52c41a" }}
            >
              {loadStops?.filter((s) => s.stopType === 1).length || 0}
            </div>
            <div style={{ color: "#8c8c8c", marginTop: "4px" }}>
              Delivery Points
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div
              style={{ fontSize: "24px", fontWeight: "bold", color: "#722ed1" }}
            >
              {loadStops?.length || 0}
            </div>
            <div style={{ color: "#8c8c8c", marginTop: "4px" }}>
              Total Stops
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default LoadSummaryStep;
