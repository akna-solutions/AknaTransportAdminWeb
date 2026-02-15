import { Typography } from "antd";

const { Title, Text } = Typography;

const WelcomeSection = () => {
  return (
    <div
      style={{
        height: "100vh",
        background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Geometric Background Pattern */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            linear-gradient(45deg, transparent 35%, rgba(255,255,255,0.1) 35%, rgba(255,255,255,0.1) 65%, transparent 65%),
            linear-gradient(-45deg, transparent 35%, rgba(255,255,255,0.05) 35%, rgba(255,255,255,0.05) 65%, transparent 65%)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      <div
        style={{
          textAlign: "center",
          zIndex: 1,
          color: "white",
          maxWidth: "400px",
          padding: "0 20px",
        }}
      >
        <div style={{ marginBottom: 30 }}>
          <div
            style={{
              width: 60,
              height: 60,
              background: "rgba(255,255,255,0.2)",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.3)",
            }}
          >
            <span style={{ fontSize: 24, fontWeight: "bold" }}>AK</span>
          </div>
          <Title level={2} style={{ color: "white", margin: 0, fontSize: 28 }}>
            AKNA Transport
          </Title>
        </div>

        <Title
          level={1}
          style={{
            color: "white",
            marginBottom: 20,
            fontSize: 42,
            lineHeight: 1.2,
          }}
        >
          Edit Smarter. Export Faster.
          <br />
          Create Anywhere.
        </Title>

        <Text
          style={{
            color: "rgba(255,255,255,0.8)",
            fontSize: 16,
            lineHeight: 1.6,
          }}
        >
          From quick social media clips to full-length videos, our powerful
          editor lets you work seamlessly across devices.
        </Text>
      </div>
    </div>
  );
};

export default WelcomeSection;
