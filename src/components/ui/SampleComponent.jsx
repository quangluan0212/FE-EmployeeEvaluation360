import { showSuccess, showError, showConfirm } from '../utils/notifications'

const SampleComponent = () => {
  const handleAction = async () => {
    try {
      const result = await showConfirm(
        'Xác nhận hành động',
        'Bạn có chắc chắn muốn thực hiện hành động này?',
        'Thực hiện',
        'Hủy'
      )
      if (result.isConfirmed) {
        // Perform action
        showSuccess('Thành công', 'Hành động đã được thực hiện!')
      }
    } catch (error) {
      showError('Lỗi', 'Đã có lỗi xảy ra. Vui lòng thử lại!')
    }
  }

  return (
    <button onClick={handleAction} className="px-4 py-2 bg-cyan-500 text-white rounded-lg">
      Thực hiện hành động
    </button>
  )
}

export default SampleComponent