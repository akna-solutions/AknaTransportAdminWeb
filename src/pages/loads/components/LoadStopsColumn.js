import React from "react";
import { Tag, Tooltip } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";

const LoadStopsColumn = ({ stops }) => {
  if (!stops || stops.length === 0) {
    return <span style={{ color: "#8c8c8c" }}>Durak yok</span>;
  }

  const sortedStops = [...stops].sort((a, b) => a.stopOrder - b.stopOrder);
  const pickupStops = sortedStops.filter((stop) => stop.stopType === 0);
  const deliveryStops = sortedStops.filter((stop) => stop.stopType === 1);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      {pickupStops.length > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Tag
            style={{
              margin: 0,
              fontSize: "11px",
              padding: "2px 8px",
              borderRadius: "4px",
              border: "1px solid #d9d9d9",
              background: "#f5f5f5",
              color: "#595959",
            }}
          >
            Alış
          </Tag>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
            {pickupStops.map((stop, index) => (
              <Tooltip
                key={index}
                title={
                  <div>
                    <div>
                      <strong>
                        {stop.city}, {stop.district}
                      </strong>
                    </div>
                    <div style={{ fontSize: "12px" }}>{stop.address}</div>
                  </div>
                }
              >
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    fontSize: "12px",
                    color: "#333333",
                    cursor: "pointer",
                  }}
                >
                  <EnvironmentOutlined style={{ fontSize: "10px" }} />
                  <span>{stop.city}</span>
                  {index < pickupStops.length - 1 && (
                    <span style={{ color: "#d9d9d9" }}>→</span>
                  )}
                </div>
              </Tooltip>
            ))}
          </div>
        </div>
      )}

      {deliveryStops.length > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Tag
            style={{
              margin: 0,
              fontSize: "11px",
              padding: "2px 8px",
              borderRadius: "4px",
              border: "1px solid #d9d9d9",
              background: "#f0f0f0",
              color: "#595959",
            }}
          >
            Teslimat
          </Tag>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
            {deliveryStops.map((stop, index) => (
              <Tooltip
                key={index}
                title={
                  <div>
                    <div>
                      <strong>
                        {stop.city}, {stop.district}
                      </strong>
                    </div>
                    <div style={{ fontSize: "12px" }}>{stop.address}</div>
                  </div>
                }
              >
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    fontSize: "12px",
                    color: "#555555",
                    cursor: "pointer",
                  }}
                >
                  <EnvironmentOutlined style={{ fontSize: "10px" }} />
                  <span>{stop.city}</span>
                  {index < deliveryStops.length - 1 && (
                    <span style={{ color: "#d9d9d9" }}>→</span>
                  )}
                </div>
              </Tooltip>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoadStopsColumn;
