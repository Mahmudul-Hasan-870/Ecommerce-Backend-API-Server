// Server-side toast helper for consistent notifications
// This file provides helper functions for sending toast notifications to clients

const sendToastNotification = (res, type, message, data = {}) => {
  return res.json({
    success: true,
    message,
    toast: {
      type, // 'success', 'error', 'warning', 'info'
      message,
      data
    },
    ...data
  })
}

// Success notifications
const sendSuccessToast = (res, message, data = {}) => {
  return sendToastNotification(res, 'success', message, data)
}

// Error notifications
const sendErrorToast = (res, message, data = {}) => {
  return res.status(400).json({
    success: false,
    message,
    toast: {
      type: 'error',
      message,
      data
    },
    ...data
  })
}

// Warning notifications
const sendWarningToast = (res, message, data = {}) => {
  return sendToastNotification(res, 'warning', message, data)
}

// Info notifications
const sendInfoToast = (res, message, data = {}) => {
  return sendToastNotification(res, 'info', message, data)
}

// Custom action notifications
const sendCreateSuccess = (res, itemName, data = {}) => {
  return sendSuccessToast(res, `${itemName} created successfully!`, data)
}

const sendUpdateSuccess = (res, itemName, data = {}) => {
  return sendSuccessToast(res, `${itemName} updated successfully!`, data)
}

const sendDeleteSuccess = (res, itemName, data = {}) => {
  return sendSuccessToast(res, `${itemName} deleted successfully!`, data)
}

const sendActionPending = (res, action, data = {}) => {
  return sendInfoToast(res, `${action} in progress...`, data)
}

const sendActionComplete = (res, action, data = {}) => {
  return sendSuccessToast(res, `${action} completed successfully!`, data)
}

const sendActionFailed = (res, action, error = '', data = {}) => {
  return sendErrorToast(res, `${action} failed! ${error}`, data)
}

module.exports = {
  sendToastNotification,
  sendSuccessToast,
  sendErrorToast,
  sendWarningToast,
  sendInfoToast,
  sendCreateSuccess,
  sendUpdateSuccess,
  sendDeleteSuccess,
  sendActionPending,
  sendActionComplete,
  sendActionFailed
} 