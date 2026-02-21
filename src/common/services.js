import { API_URLS, getHeaders, handleApiError } from "./apiConfig";

export const services = {
  // Load Services
  createLoad: async (loadData) => {
    try {
      const response = await fetch(`${API_URLS.LOAD}/api/load/create`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(loadData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      return handleApiError(error);
    }
  },

  getLoadsList: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams({
        PageNumber: filters.pageNumber || 1,
        PageSize: filters.pageSize || 10,
        ...(filters.title && { Title: filters.title }),
        ...(filters.city && { City: filters.city }),
        ...(filters.district && { District: filters.district }),
        ...(filters.minWeight && { MinWeight: filters.minWeight }),
        ...(filters.maxWeight && { MaxWeight: filters.maxWeight }),
        ...(filters.minVolume && { MinVolume: filters.minVolume }),
        ...(filters.maxVolume && { MaxVolume: filters.maxVolume }),
        ...(filters.startDate && { StartDate: filters.startDate }),
        ...(filters.endDate && { EndDate: filters.endDate }),
      });

      const response = await fetch(
        `${API_URLS.LOAD}/api/load/list?${queryParams}`,
        {
          method: "GET",
          headers: getHeaders(),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      return handleApiError(error);
    }
  },

  updateLoad: async (loadData) => {
    try {
      const response = await fetch(`${API_URLS.LOAD}/api/load/update`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(loadData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      return handleApiError(error);
    }
  },

  deleteLoad: async (loadId, userId) => {
    try {
      const response = await fetch(`${API_URLS.LOAD}/api/load/delete`, {
        method: "DELETE",
        headers: getHeaders(),
        body: JSON.stringify({ id: loadId, userId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Dashboard Services
  getUsersList: async (filters = {}) => {
    try {
      const response = await fetch(`${API_URLS.IDENTITY}/api/user/list`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          page: 1,
          pageSize: 10,
          includeDeleted: false,
          ...filters,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Get users list error:", error);
      throw error;
    }
  },

  getVehiclesList: async (filters = {}) => {
    try {
      const response = await fetch(`${API_URLS.IDENTITY}/api/vehicle/list`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          page: 1,
          pageSize: 10,
          includeDeleted: false,
          ...filters,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Get vehicles list error:", error);
      throw error;
    }
  },

  deleteUser: async (userId) => {
    try {
      const response = await fetch(
        `${API_URLS.IDENTITY}/api/user/soft-delete/${userId}`,
        {
          method: "POST",
          headers: getHeaders(),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error("Delete user error:", error);
      throw error;
    }
  },

  deleteVehicle: async (vehicleId) => {
    try {
      const response = await fetch(
        `${API_URLS.IDENTITY}/api/vehicle/soft-delete/${vehicleId}`,
        {
          method: "POST",
          headers: getHeaders(),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error("Delete vehicle error:", error);
      throw error;
    }
  },

  updateUser: async (userData) => {
    try {
      const response = await fetch(`${API_URLS.IDENTITY}/api/user/update`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Update user error:", error);
      throw error;
    }
  },

  updateVehicle: async (vehicleData) => {
    try {
      const response = await fetch(`${API_URLS.IDENTITY}/api/vehicle/update`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(vehicleData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Update vehicle error:", error);
      throw error;
    }
  },

  // Authentication Services
  loginUser: async (loginData) => {
    const response = await fetch(
      `${API_URLS.IDENTITY}/api/authentication/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      },
    );

    const data = await response.json();
    return data;
  },

  registerUser: async (registerData) => {
    try {
      const response = await fetch(
        `${API_URLS.IDENTITY}/api/authentication/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(registerData),
        },
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
  },

  verifyUser: async (verificationData) => {
    try {
      const response = await fetch(
        `${API_URLS.IDENTITY}/api/authentication/verify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(verificationData),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error("Verify service error:", error);
      throw error;
    }
  },

  generateVerificationCode: async (codeData) => {
    try {
      const response = await fetch(
        `${API_URLS.IDENTITY}/api/authentication/generate-verification-code`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(codeData),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error("Generate verification code service error:", error);
      throw error;
    }
  },
};
