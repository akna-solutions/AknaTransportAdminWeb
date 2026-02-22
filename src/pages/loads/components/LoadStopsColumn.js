import React from "react";
import { Tag, Tooltip } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";

const LoadStopsColumn = ({ stops }) => {
  if (!stops || stops.length === 0) {
    return <span style={{ color: "#8c8c8c" }}>No stops</span>;
  }

  // Sort stops by order
  const sortedStops = [...stops].sort((a, b) => a.stopOrder - b.stopOrder);

  // Get pickup and delivery stops
  const pickupStops = sortedStops.filter((stop) => stop.stopType === 0);
  const deliveryStops = sortedStops.filter((stop) => stop.stopType === 1);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      {/* Pickup Stops */}
      {pickupStops.length > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Tag
            color="blue"
            style={{
              margin: 0,
              fontSize: "11px",
              padding: "2px 8px",
              borderRadius: "4px",
            }}
          >
            Pickup
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
                    color: "#1890ff",
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

      {/* Delivery Stops */}
      {deliveryStops.length > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Tag
            color="green"
            style={{
              margin: 0,
              fontSize: "11px",
              padding: "2px 8px",
              borderRadius: "4px",
            }}
          >
            Delivery
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
                    color: "#52c41a",
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
