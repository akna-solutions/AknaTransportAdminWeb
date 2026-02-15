import { Button, Input, Card } from "antd";

const Login = () => {
  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: 100 }}>
      <Card title="Giriş Yap" style={{ width: 300 }}>
        <Input placeholder="Email" style={{ marginBottom: 10 }} />
        <Input.Password placeholder="Şifre" style={{ marginBottom: 10 }} />
        <Button type="primary" block>
          Giriş Yap
        </Button>
      </Card>
    </div>
  );
};

export default Login;
