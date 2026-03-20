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
      text: "Taslak",
      icon: <FileTextOutlined />,
    },
    published: {
      text: "Yayında",
      icon: <RocketOutlined />,
    },
    matched: {
      text: "Eşleştirildi",
      icon: <CheckCircleOutlined />,
    },
    completed: {
      text: "Tamamlandı",
      icon: <TrophyOutlined />,
    },
  };

  const config = statusConfig[status] || statusConfig.draft;

  return (
    <Tag
      icon={config.icon}
      style={{
        fontSize: "12px",
        padding: "4px 12px",
        borderRadius: "6px",
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        border: "1px solid #e8e8e8",
        background: "#f5f5f5",
        color: "#595959",
      }}
    >
      {config.text}
    </Tag>
  );
};

export default LoadStatusTag;
