import React, { useEffect, useState } from "react";

const ProjectManagement = () => {
  const [projects, setProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [currentProject, setCurrentProject] = useState({
    maDuAn: "",
    tenDuAn: "",
    trangThai: "Active",
  });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Replace with your API call to fetch projects
        const response = await fetch(`/api/projects?page=${currentPage}&search=${searchTerm}`);
        const data = await response.json();
        setProjects(data.items);
        setCurrentPage(data.currentPage);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, [currentPage, searchTerm]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleAddProject = () => {
    setCurrentProject({ maDuAn: "", tenDuAn: "", trangThai: "Active" });
    setShowModal(true);
  };

  const handleEditProject = (project) => {
    setCurrentProject(project);
    setShowModal(true);
  };

  const handleDeleteProject = async (maDuAn) => {
    const userConfirmed = window.confirm("Bạn có chắc chắn muốn xóa dự án này?");
    if (!userConfirmed) {
      return;
    }

    try {
      // Replace with your API call to delete a project
      await fetch(`/api/projects/${maDuAn}`, { method: "DELETE" });
      alert("Xóa dự án thành công!");
      setProjects((prevProjects) => prevProjects.filter((project) => project.maDuAn !== maDuAn));
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("Xóa dự án thất bại. Vui lòng thử lại!");
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleSaveProject = async () => {
    try {
      if (!currentProject.tenDuAn) {
        alert("Tên dự án không được để trống!");
        return;
      }

      if (currentProject.maDuAn) {
        // Replace with your API call to update a project
        await fetch(`/api/projects/${currentProject.maDuAn}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(currentProject),
        });
        alert("Cập nhật dự án thành công!");
      } else {
        // Replace with your API call to add a new project
        await fetch(`/api/projects`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(currentProject),
        });
        alert("Thêm dự án thành công!");
      }

      setShowModal(false);
    } catch (error) {
      console.error("Error saving project:", error);
      alert("Lưu dự án thất bại. Vui lòng thử lại!");
    }
  };

  return (
    <div className="w-full mx-auto p-6 bg-white shadow-md rounded-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý dự án</h1>

        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Nhập tên dự án"
            className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAddProject}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Thêm dự án
          </button>
        </div>
      </div>

      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b text-left">Mã dự án</th>
            <th className="py-2 px-4 border-b text-left">Tên dự án</th>
            <th className="py-2 px-4 border-b text-left">Trạng thái</th>
            <th className="py-2 px-4 border-b text-left">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.maDuAn}>
              <td className="py-2 px-4 border-b">{project.maDuAn}</td>
              <td className="py-2 px-4 border-b">{project.tenDuAn}</td>
              <td className="py-2 px-4 border-b">{project.trangThai}</td>
              <td className="py-2 px-4 border-b">
                <button
                  onClick={() => handleEditProject(project)}
                  className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 mr-2"
                >
                  Sửa
                </button>
                <button
                  onClick={() => handleDeleteProject(project.maDuAn)}
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50"
        >
          Trang trước
        </button>
        <span>
          Trang {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50"
        >
          Trang sau
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md w-1/3">
            <h2 className="text-xl font-bold mb-4">
              {currentProject.maDuAn ? "Cập nhật dự án" : "Thêm dự án"}
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                name="tenDuAn"
                value={currentProject.tenDuAn}
                onChange={(e) =>
                  setCurrentProject({ ...currentProject, tenDuAn: e.target.value })
                }
                placeholder="Tên dự án"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                name="trangThai"
                value={currentProject.trangThai}
                onChange={(e) =>
                  setCurrentProject({ ...currentProject, trangThai: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div className="flex justify-end space-x-4 mt-4">
              <button
                onClick={handleModalClose}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveProject}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectManagement;
