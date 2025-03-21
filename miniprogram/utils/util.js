// util.js
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

// 格式化日期，返回如"5月20日"的格式
const formatDate = timestamp => {
  const date = new Date(timestamp)
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${month}月${day}日`
}

// 格式化时间，返回如"10:30"的格式
const formatHourMinute = timestamp => {
  const date = new Date(timestamp)
  const hour = date.getHours()
  const minute = date.getMinutes()
  return `${formatNumber(hour)}:${formatNumber(minute)}`
}

// 计算时间差，返回相对时间（如"刚刚"、"5分钟前"等）
const relativeTime = timestamp => {
  const now = Date.now()
  const diff = now - timestamp

  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour
  const week = 7 * day
  const month = 30 * day

  if (diff < minute) {
    return '刚刚'
  } else if (diff < hour) {
    return `${Math.floor(diff / minute)}分钟前`
  } else if (diff < day) {
    return `${Math.floor(diff / hour)}小时前`
  } else if (diff < week) {
    return `${Math.floor(diff / day)}天前`
  } else if (diff < month) {
    return `${Math.floor(diff / week)}周前`
  } else {
    return formatDate(timestamp)
  }
}

// 格式化文件大小
const formatFileSize = size => {
  if (size < 1024) {
    return size + 'B'
  } else if (size < 1024 * 1024) {
    return (size / 1024).toFixed(2) + 'KB'
  } else if (size < 1024 * 1024 * 1024) {
    return (size / (1024 * 1024)).toFixed(2) + 'MB'
  } else {
    return (size / (1024 * 1024 * 1024)).toFixed(2) + 'GB'
  }
}

// 截断长文本，添加省略号
const truncateText = (text, maxLength = 50) => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

// 生成随机ID
const generateRandomId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2)
}

module.exports = {
  formatTime,
  formatNumber,
  formatDate,
  formatHourMinute,
  relativeTime,
  formatFileSize,
  truncateText,
  generateRandomId
}