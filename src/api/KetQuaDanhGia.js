import apiClient from './api';

export const getAllKetQuaDanhGia = async (page = 1, pageSize =10, search = '') => {
  try {
    const response = await apiClient.get('/KetQuaDanhGia/get-all-ket-qua-danh-gia', {
      params: {
        page,
        pageSize,
        search
      }
    });
    return response;
  } catch (error) {
    console.error('Error fetching Ket Qua Danh Gia:', error);
    throw error;
  }
}
export const getLatestQuaDanhGia = async (page = 1, pageSize =10, search = '') => {
  try {
    const response = await apiClient.get('/KetQuaDanhGia/get-latest-ket-qua-danh-gia', {
      params: {
        page,
        pageSize,
        search
      }
    });
    return response;
  } catch (error) {
    console.error('Error fetching latest Ket Qua Danh Gia:', error);
    throw error;
  }
}
export const getGoodQuaDanhGia = async (page = 1, pageSize =10, search = '') => {
  try {
    const response = await apiClient.get('/KetQuaDanhGia/get-good-ket-qua-danh-gia', {
      params: {
        page,
        pageSize,
        search
      }
    });
    return response;
  } catch (error) {
    console.error('Error fetching good Ket Qua Danh Gia:', error);
    throw error;
  }
}
export const getBadQuaDanhGia = async (page = 1, pageSize =10, search = '') => {
  try {
    const response = await apiClient.get('/KetQuaDanhGia/get-bad-ket-qua-danh-gia', {
      params: {
        page,
        pageSize,
        search
      }
    });
    return response;
  } catch (error) {
    console.error('Error fetching bad Ket Qua Danh Gia:', error);
    throw error;
  }
}