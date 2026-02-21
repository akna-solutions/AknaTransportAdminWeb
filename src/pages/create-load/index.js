import React, { useState } from "react";
import {
  Form,
  Input,
  InputNumber,
  Button,
  Card,
  Steps,
  message,
  Space,
} from "antd";
import {
  FileTextOutlined,
  EnvironmentOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../common/components/MainLayout";
import LoadInfoStep from "./components/LoadInfoStep";
import LoadStopsStep from "./components/LoadStopsStep";
import LoadSummaryStep from "./components/LoadSummaryStep";
import { services } from "../../common/services";

const { Step } = Steps;

const CreateLoad = () => {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadStops, setLoadStops] = useState([]);
  const navigate = useNavigate();

  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");

  const steps = [
    {
      title: "Load Information",
      icon: <FileTextOutlined />,
      description: "Basic load details",
    },
    {
      title: "Stops",
      icon: <EnvironmentOutlined />,
      description: "Pickup & delivery locations",
    },
    {
      title: "Review",
      icon: <CheckOutlined />,
      description: "Confirm details",
    },
  ];

  const handleNext = async () => {
    try {
      // Validate current step
      if (currentStep === 0) {
        await form.validateFields([
          "title",
          "description",
          "weight",
          "volume",
          "contactPersonName",
          "contactPhone",
          "contactEmail",
        ]);
      } else if (currentStep === 1) {
        if (loadStops.length < 2) {
          message.error("At least one pickup and one delivery stop required");
          return;
        }
        const hasPickup = loadStops.some((stop) => stop.stopType === 0);
        const hasDelivery = loadStops.some((stop) => stop.stopType === 1);
        if (!hasPickup || !hasDelivery) {
          message.error("Both pickup and delivery stops are required");
          return;
        }
      }

      setCurrentStep(currentStep + 1);
    } catch (error) {
      message.error("Please fill in all required fields");
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = form.getFieldsValue();

      const loadData = {
        userId: userInfo.userId,
        title: values.title,
        description: values.description,
        weight: values.weight,
        volume: values.volume,
        contactPersonName: values.contactPersonName,
        contactPhone: values.contactPhone,
        contactEmail: values.contactEmail,
        loadStops: loadStops.map((stop, index) => ({
          stopType: stop.stopType,
          stopOrder: index + 1,
          contactPersonName: stop.contactPersonName,
          contactPhone: stop.contactPhone,
          address: stop.address,
          city: stop.city,
          district: stop.district,
          country: stop.country || "Türkiye",
        })),
      };

      const response = await services.createLoad(loadData);

      if (response.isSuccess) {
        message.success("Load created successfully!");
        navigate("/dashboard");
      } else {
        message.error(response.message || "Failed to create load");
      }
    } catch (error) {
      message.error("An error occurred while creating the load");
      console.error("Create load error:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <LoadInfoStep form={form} />;
      case 1:
        return (
          <LoadStopsStep
            loadStops={loadStops}
            setLoadStops={setLoadStops}
            form={form}
          />
        );
      case 2:
        return <LoadSummaryStep form={form} loadStops={loadStops} />;
      default:
        return null;
    }
  };

  return (
    <MainLayout>
      <div
        style={{
          padding: "40px",
          minHeight: "100vh",
          background: "#f5f5f5",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          {/* Header */}
          <div style={{ marginBottom: "32px" }}>
            <h1
              style={{
                fontSize: "32px",
                fontWeight: "700",
                color: "#1a1a1a",
                margin: 0,
              }}
            >
              Create New Load
            </h1>
            <p style={{ color: "#8c8c8c", fontSize: "16px", marginTop: "8px" }}>
              Fill in the details to create a new transportation load
            </p>
          </div>

          {/* Steps */}
          <Card
            style={{
              borderRadius: "16px",
              marginBottom: "24px",
              border: "1px solid #f0f0f0",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            }}
          >
            <Steps current={currentStep}>
              {steps.map((step, index) => (
                <Step
                  key={index}
                  title={step.title}
                  description={step.description}
                  icon={step.icon}
                />
              ))}
            </Steps>
          </Card>

          {/* Content */}
          <Form form={form} layout="vertical">
            {renderStepContent()}
          </Form>

          {/* Actions */}
          <Card
            style={{
              borderRadius: "16px",
              marginTop: "24px",
              border: "1px solid #f0f0f0",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            }}
          >
            <Space
              style={{
                width: "100%",
                justifyContent: "space-between",
              }}
            >
              <Button
                onClick={() => navigate("/dashboard")}
                size="large"
                style={{ borderRadius: "8px" }}
              >
                Cancel
              </Button>

              <Space>
                {currentStep > 0 && (
                  <Button
                    onClick={handlePrevious}
                    size="large"
                    style={{ borderRadius: "8px" }}
                  >
                    Previous
                  </Button>
                )}

                {currentStep < steps.length - 1 ? (
                  <Button
                    type="primary"
                    onClick={handleNext}
                    size="large"
                    style={{
                      borderRadius: "8px",
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      border: "none",
                    }}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    onClick={handleSubmit}
                    loading={loading}
                    size="large"
                    style={{
                      borderRadius: "8px",
                      background:
                        "linear-gradient(135deg, #52c41a 0%, #389e0d 100%)",
                      border: "none",
                    }}
                  >
                    Create Load
                  </Button>
                )}
              </Space>
            </Space>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default CreateLoad;
