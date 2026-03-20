import { useState } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Checkbox,
  Divider,
  Typography,
  message,
} from "antd";
import {
  GoogleOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { services } from "../../../common/services";
import { darkTheme } from "../../../common/darkTheme";

const { Title, Text, Link } = Typography;

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const response = await services.loginUser({
        userCode: values.email,
        password: values.password,
        rememberMe: values.remember || false,
      });

      if (response.isSuccess) {
        message.success("Giriş başarılı!");
        // Token'ları localStorage'a kaydet
        localStorage.setItem("accessToken", response.accessToken);
        localStorage.setItem("refreshToken", response.refreshToken);
        localStorage.setItem(
          "userInfo",
          JSON.stringify({
            userId: response.userId,
            userCode: response.userCode,
            email: response.email,
            name: response.name,
            surname: response.surname,
            userType: response.userType,
          }),
        );
        navigate("/dashboard");
      } else {
        message.error(response.resultMessage || "Giriş başarısız!");
      }
    } catch (error) {
      console.error("Login error:", error);
      message.error("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        background: darkTheme.primaryBg,
      }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: 420,
          boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
          borderRadius: "16px",
          border: `1px solid ${darkTheme.borderColor}`,
          background: darkTheme.cardBg,
        }}
        bodyStyle={{ padding: "40px 30px" }}
      >
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Title level={2} style={{ margin: 0, fontSize: 32, fontWeight: 600, color: darkTheme.primaryText }}>
            Hoş Geldiniz!
          </Title>
          <Text style={{ color: darkTheme.secondaryText, fontSize: 16 }}>
            Sisteme giriş yaparak yönetim paneline erişin.
          </Text>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
        >
          <Form.Item
            label={<span style={{ color: darkTheme.primaryText }}>E-mail</span>}
            name="email"
            rules={[
              { required: true, message: "E-mail gerekli!" },
              { type: "email", message: "Geçerli bir e-mail adresi girin!" },
            ]}
          >
            <Input
              placeholder="E-mail adresinizi girin"
              size="large"
              style={{
                borderRadius: "8px",
                border: `1px solid ${darkTheme.borderColor}`,
                boxShadow: "none",
                background: darkTheme.secondaryBg,
                color: darkTheme.primaryText,
              }}
            />
          </Form.Item>

          <Form.Item
            label={<span style={{ color: darkTheme.primaryText }}>Şifre</span>}
            name="password"
            rules={[
              { required: true, message: "Şifre gerekli!" },
              { min: 6, message: "Şifre en az 6 karakter olmalı!" },
            ]}
          >
            <Input.Password
              placeholder="Şifrenizi girin"
              size="large"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              style={{
                borderRadius: "8px",
                border: `1px solid ${darkTheme.borderColor}`,
                boxShadow: "none",
                background: darkTheme.secondaryBg,
                color: darkTheme.primaryText,
              }}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 16 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox style={{ color: darkTheme.primaryText }}>Beni Hatırla</Checkbox>
              </Form.Item>
              <Link href="#" style={{ color: "#667eea" }}>
                Şifremi Unuttum?
              </Link>
            </div>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              style={{
                width: "100%",
                height: "48px",
                borderRadius: "8px",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                border: "none",
                fontSize: "16px",
                fontWeight: 500,
                color: "#ffffff",
              }}
            >
              Giriş Yap
            </Button>
          </Form.Item>

          <Divider style={{ color: darkTheme.secondaryText, fontSize: 14 }}>
            ya da devam et
          </Divider>

          <Button
            icon={<GoogleOutlined />}
            size="large"
            style={{
              width: "100%",
              height: "48px",
              borderRadius: "8px",
              border: `1px solid ${darkTheme.borderColor}`,
              background: darkTheme.secondaryBg,
              color: darkTheme.primaryText,
              fontSize: "16px",
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            Google ile Devam Et
          </Button>

          <div style={{ textAlign: "center", marginTop: 24 }}>
            <Text style={{ color: darkTheme.secondaryText }}>
              Hesabınız yok mu?{" "}
              <Link
                href="/register"
                style={{ color: "#667eea", fontWeight: 500 }}
              >
                Kayıt Ol
              </Link>
            </Text>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default LoginForm;
