import { useState } from "react";
import {
  fetchLatestEvaluations,
  fetchBestEvaluation,
  fetchWorstEvaluation,
} from "../api/ApiHandlers";
// import { getLatestQuaDanhGiaPaged, getGoodQuaDanhGiaPaged, getBadQuaDanhGiaPaged } from "../api/ApiHandlers";

const useModal = (selectedMaDotDanhGia) => {
  const [showModal, setShowModal] = useState(null);
  const [modalData, setModalData] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalSearchQuery, setModalSearchQuery] = useState("");
  const [modalCurrentPage, setModalCurrentPage] = useState(1);
  const [modalTotalPages, setModalTotalPages] = useState(1);

  const openModal = async (modalType, setModalData, setModalTotalPages) => {
    setShowModal(modalType);
    setModalData([]);
    setModalCurrentPage(1);
    setModalSearchQuery("");
    try {
      setModalLoading(true);
      let data;
      if (modalType === "latest") {
        data = await fetchLatestEvaluations(
          1,
          "",
          true,
          selectedMaDotDanhGia || null,
          () => {},
          () => {}
        );
      } else if (modalType === "best") {
        data = await fetchBestEvaluation(
          1,
          "",
          true,
          selectedMaDotDanhGia || null,
          () => {},
          () => {}
        );
      } else if (modalType === "worst") {
        data = await fetchWorstEvaluation(
          1,
          "",
          true,
          selectedMaDotDanhGia || null,
          () => {},
          () => {}
        );
      }
      setModalData(data.items || []);
      setModalTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error(`Lỗi khi tải dữ liệu ${modalType}:`, error);
    } finally {
      setModalLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(null);
  };

  const handleModalSearch = async () => {
    setModalCurrentPage(1);
    try {
      setModalLoading(true);
      let data;
      if (showModal === "latest") {
        data = await fetchLatestEvaluations(
          1,
          modalSearchQuery,
          true,
          selectedMaDotDanhGia || null,
          () => {},
          () => {}
        );
      } else if (showModal === "best") {
        data = await fetchBestEvaluation(
          1,
          modalSearchQuery,
          true,
          selectedMaDotDanhGia || null,
          () => {},
          () => {}
        );
      } else if (showModal === "worst") {
        data = await fetchWorstEvaluation(
          1,
          modalSearchQuery,
          true,
          selectedMaDotDanhGia || null,
          () => {},
          () => {}
        );
      }
      setModalData(data.items || []);
      setModalTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error(`Lỗi khi tìm kiếm ${showModal}:`, error);
    } finally {
      setModalLoading(false);
    }
  };

  const handleModalPageChange = async (newPage) => {
    setModalCurrentPage(newPage);
    try {
      setModalLoading(true);
      let data;
      if (showModal === "latest") {
        data = await fetchLatestEvaluations(
          newPage,
          modalSearchQuery,
          true,
          selectedMaDotDanhGia || null,
          () => {},
          () => {}
        );
      } else if (showModal === "best") {
        data = await fetchBestEvaluation(
          newPage,
          modalSearchQuery,
          true,
          selectedMaDotDanhGia || null,
          () => {},
          () => {}
        );
      } else if (showModal === "worst") {
        data = await fetchWorstEvaluation(
          newPage,
          modalSearchQuery,
          true,
          selectedMaDotDanhGia || null,
          () => {},
          () => {}
        );
      }
      setModalData(data.items || []);
      setModalTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error(`Lỗi khi chuyển trang ${showModal}:`, error);
    } finally {
      setModalLoading(false);
    }
  };

  return {
    showModal,
    modalData,
    modalLoading,
    modalSearchQuery,
    modalCurrentPage,
    modalTotalPages,
    openModal,
    closeModal,
    handleModalSearch,
    handleModalPageChange,
    setModalData,
    setModalTotalPages,
    setModalSearchQuery,
  };
};

export default useModal;
