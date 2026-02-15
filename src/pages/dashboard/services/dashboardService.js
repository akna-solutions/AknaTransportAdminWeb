const API_BASE_URL = "https://localhost:7165";

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem("accessToken");
};

// Create headers with authorization
const getHeaders = () => {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const dashboardService = {
  // Get users list
  getUsersList: async (filters = {}) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/user/list`, {
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

  // Get vehicles list
  getVehiclesList: async (filters = {}) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/vehicle/list`, {
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

  // Delete user (soft delete)
  deleteUser: async (userId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/user/soft-delete/${userId}`,
        {
          method: "POST",
          headers: getHeaders(),
        }
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

  // Delete vehicle (soft delete)
  deleteVehicle: async (vehicleId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/vehicle/soft-delete/${vehicleId}`,
        {
          method: "POST",
          headers: getHeaders(),
        }
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

  // Update user
  updateUser: async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/user/update`, {
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

  // Update vehicle
  updateVehicle: async (vehicleData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/vehicle/update`, {
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
};
