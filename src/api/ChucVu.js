import apiClient from "./api";

export const GetCapBacChucVu = async ( maNguoiDung, maChucVu) => {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) {
            throw new Error('Token không tồn tại');
        }

        const response = await apiClient.get('/ChucVu/admin-get-cap-bac-nguoi-dung', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                maNguoiDung: maNguoiDung,
                maChucVu: maChucVu
            }
        });
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy danh sách chức vụ:', error);
        throw error;
    }
};


export const UpdateChucVu = async (formData) => {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) {
            throw new Error('Token không tồn tại');
        }

        const response = await apiClient.put('/ChucVu/admin-cap-nhat-chuc-vu', formData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy danh sách chức vụ:', error);
        throw error;
    }
};

export const getChucVuList = async () => {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) {
            throw new Error('Token không tồn tại');
        }

        const response = await apiClient.get('/ChucVu/danh-sach-chuc-vu', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy danh sách chức vụ:', error);
        throw error;
    }
};

export const getChucVuPagedList = async (page, pageSize, search = '') => {
  try {
    const token = localStorage.getItem('authToken');

    if (!token) throw new Error('Token không tồn tại');

    const response = await apiClient.get('/ChucVu/danh-sach-chuc-vu-paged', {
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
    console.error('Lỗi lấy chức vụ:', error);
    throw error;
  }
}

export const addChucVu = async (chucVuData) => {
    try {
        const token = localStorage.getItem('authToken');
    
        if (!token) throw new Error('Token không tồn tại'); 
        const response = await apiClient.post('/ChucVu/them-chuc-vu', chucVuData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (response.code === 200) {
            return response.data;
        } else {
            throw new Error(response.message || 'Lỗi không xác định');
        }
    }
    catch (error) {
        console.error('Lỗi khi thêm chức vụ:', error);
        throw error;
    }
};

export const updateChucVu = async (id, chucVuData) => {
    try {
        const token = localStorage.getItem('authToken');
    
        if (!token) throw new Error('Token không tồn tại'); 
        const response = await apiClient.put(`/ChucVu/cap-nhat-chuc-vu?id=${id}`, chucVuData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (response.code === 200) {
            return response.data;
        } else {
            throw new Error(response.message || 'Lỗi không xác định');
        }
    }
    catch (error) {
        console.error('Lỗi khi cập nhật chức vụ:', error);
        throw error;
    }
};

export const deleteChucVu = async (id) => {
    try {
        const token = localStorage.getItem('authToken');
    
        if (!token) throw new Error('Token không tồn tại');
        const response = await apiClient.delete(`/ChucVu/xoa-chuc-vu`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                id: id,
            },
        });
        if (response.code === 200) {
            return response.data;
        } else {
            throw new Error(response.message || 'Lỗi không xác định');
        }
    }
    catch (error) {
        console.error('Lỗi khi xóa chức vụ:', error);
        throw error;
    }
};
