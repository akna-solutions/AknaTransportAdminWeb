import { Row, Col } from "antd";
import WelcomeSection from "./components/WelcomeSection";
import LoginForm from "./components/LoginForm";

const Login = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <Row style={{ minHeight: "100vh" }}>
        <Col xs={0} md={12} lg={14}>
          <WelcomeSection />
        </Col>
        <Col xs={24} md={12} lg={10}>
          <LoginForm />
        </Col>
      </Row>
    </div>
  );
};

export default Login;
