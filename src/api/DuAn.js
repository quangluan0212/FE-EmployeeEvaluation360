import apiClient from "./api";

// Fetch project list
export const getProjectList = async (page, pageSize, search = "") => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("Token không tồn tại");
    const response = await apiClient.get("/DuAn/danh-sach-du-an", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        page: page,
        pageSize: pageSize,
        search: search,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching project list:", error);
    throw error;
  }
};

// Add a new project
export const addProject = async (projectData) => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("Token không tồn tại");
    const response = await apiClient.post("/DuAn/them-du-an", projectData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding project:", error);
    throw error;
  }
};

// Get project details
export const getProjectDetails = async (projectId) => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("Token không tồn tại");
    const response = await apiClient.get(`/DuAn/chi-tiet-du-an`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { maDuAn: projectId },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching project details:", error);
    throw error;
  }
};

// Update a project
export const updateProject = async (projectId, projectData) => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("Token không tồn tại");
    const response = await apiClient.put(
      `/DuAn/cap-nhat-du-an`,projectData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { maDuAn: projectId },
      },
      
    );
    return response.data;
  } catch (error) {
    console.error("Error updating project:", error);
    throw error;
  }
};

// Delete a project
export const deleteProject = async (projectId) => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("Token không tồn tại");
    const response = await apiClient.delete(`/DuAn/xoa-du-an`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { maDuAn: projectId },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
};
