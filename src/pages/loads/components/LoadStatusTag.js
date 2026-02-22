import React from "react";
import { Tag } from "antd";
import {
  FileTextOutlined,
  CheckCircleOutlined,
  RocketOutlined,
  TrophyOutlined,
} from "@ant-design/icons";

const LoadStatusTag = ({ status }) => {
  const statusConfig = {
    draft: {
      color: "default",
      text: "Draft",
      icon: <FileTextOutlined />,
    },
    published: {
      color: "processing",
      text: "Published",
      icon: <RocketOutlined />,
    },
    matched: {
      color: "warning",
      text: "Matched",
      icon: <CheckCircleOutlined />,
    },
    completed: {
      color: "success",
      text: "Completed",
      icon: <TrophyOutlined />,
    },
  };

  const config = statusConfig[status] || statusConfig.draft;

  return (
    <Tag
      color={config.color}
      icon={config.icon}
      style={{
        fontSize: "12px",
        padding: "4px 12px",
        borderRadius: "6px",
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
      }}
    >
      {config.text}
    </Tag>
  );
};

export default LoadStatusTag;
