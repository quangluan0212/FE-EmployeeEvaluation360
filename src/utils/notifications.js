import Swal from 'sweetalert2'

export const showSuccess = (title, text, options = {}) => {
  return Swal.fire({
    icon: 'success',
    title,
    text,
    confirmButtonColor: '#0891b2',
    timer: 1500,
    timerProgressBar: true,
    ...options,
  })
}

export const showError = (title, text, options = {}) => {
  return Swal.fire({
    icon: 'error',
    title,
    text,
    confirmButtonColor: '#0891b2',
    ...options,
  })
}

export const showWarning = (title, text, options = {}) => {
  return Swal.fire({
    icon: 'warning',
    title,
    text,
    confirmButtonColor: '#0891b2',
    ...options,
  })
}

export const showConfirm = (title, text, confirmText, cancelText, options = {}) => {
  return Swal.fire({
    title,
    text,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#0891b2',
    cancelButtonColor: '#d33',
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    ...options,
  })
}