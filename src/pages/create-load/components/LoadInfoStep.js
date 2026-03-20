import React from "react";
import { Card, Form, Input, InputNumber, Row, Col } from "antd";

const { TextArea } = Input;

const LoadInfoStep = ({ form }) => {
  return (
    <Card
      style={{
        borderRadius: "16px",
        border: "1px solid #f0f0f0",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      }}
    >
      <Row gutter={[24, 24]}>
        <Col xs={24}>
          <Form.Item
            name="title"
            label="Yük Başlığı"
            rules={[
              { required: true, message: "Lütfen yük başlığı girin" },
              { max: 200, message: "Başlık 200 karakteri geçemez" },
            ]}
          >
            <Input
              placeholder="Örn: İstanbul'dan Ankara'ya Kargo"
              size="large"
              style={{ borderRadius: "8px" }}
            />
          </Form.Item>
        </Col>

        <Col xs={24}>
          <Form.Item
            name="description"
            label="Açıklama"
            rules={[
              { max: 1000, message: "Açıklama 1000 karakteri geçemez" },
            ]}
          >
            <TextArea
              rows={4}
              placeholder="Yük hakkında ek detaylar girin..."
              style={{ borderRadius: "8px" }}
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            name="weight"
            label="Ağırlık (kg)"
            rules={[
              { type: "number", min: 0, message: "Ağırlık pozitif olmalı" },
            ]}
          >
            <InputNumber
              placeholder="0"
              min={0}
              max={999999}
              style={{ width: "100%", borderRadius: "8px" }}
              size="large"
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            name="volume"
            label="Hacim (m³)"
            rules={[
              { type: "number", min: 0, message: "Hacim pozitif olmalı" },
            ]}
          >
            <InputNumber
              placeholder="0"
              min={0}
              max={999999}
              style={{ width: "100%", borderRadius: "8px" }}
              size="large"
            />
          </Form.Item>
        </Col>

        <Col xs={24}>
          <div
            style={{
              background: "#f5f5f5",
              padding: "16px",
              borderRadius: "8px",
              marginBottom: "16px",
            }}
          >
            <h4 style={{ margin: "0 0 12px 0", color: "#333333" }}>
              İletişim Bilgileri
            </h4>
            <p style={{ margin: 0, color: "#595959", fontSize: "14px" }}>
              Bu yük için iletişim bilgilerini girin
            </p>
          </div>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            name="contactPersonName"
            label="İletişim Kişisi"
            rules={[
              { max: 100, message: "İsim 100 karakteri geçemez" },
            ]}
          >
            <Input
              placeholder="Ahmet Yılmaz"
              size="large"
              style={{ borderRadius: "8px" }}
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            name="contactPhone"
            label="İletişim Telefonu"
            rules={[
              { max: 20, message: "Telefon 20 karakteri geçemez" },
              {
                pattern: /^[0-9+\-() ]*$/,
                message: "Geçersiz telefon numarası formatı",
              },
            ]}
          >
            <Input
              placeholder="+90 532 123 4567"
              size="large"
              style={{ borderRadius: "8px" }}
            />
          </Form.Item>
        </Col>

        <Col xs={24}>
          <Form.Item
            name="contactEmail"
            label="İletişim E-postası"
            rules={[
              { type: "email", message: "Lütfen geçerli bir e-posta girin" },
              { max: 100, message: "E-posta 100 karakteri geçemez" },
            ]}
          >
            <Input
              placeholder="iletisim@example.com"
              size="large"
              style={{ borderRadius: "8px" }}
            />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );
};

export default LoadInfoStep;
