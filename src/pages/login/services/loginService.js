const API_BASE_URL = "https://localhost:7165";

export const loginUser = async (loginData) => {
  const response = await fetch(`${API_BASE_URL}/api/authentication/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginData),
  });

  const data = await response.json();
  return data;
};

export const registerUser = async (registerData) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/authentication/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerData),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Register service error:", error);
    throw error;
  }
};

export const verifyUser = async (verificationData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/authentication/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(verificationData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error("Verify service error:", error);
    throw error;
  }
};

export const generateVerificationCode = async (codeData) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/authentication/generate-verification-code`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(codeData),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error("Generate verification code service error:", error);
    throw error;
  }
};
