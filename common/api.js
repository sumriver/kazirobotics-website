// 获取菜单
export const fetchMenu = (params, config = {}) => uni.$u.http.post('/ebapi/public_api/index', params, config)

// KaziSpace API 接口
export const bindWebUser = (data, config = {}) => uni.$u.http.post('/api/v1/user/bind', data, config)
export const sendChatMessage = (data, config = {}) => uni.$u.http.post('/api/v1/chat/messages', data, config)
export const fetchChatHistory = (sessionId, config = {}) => uni.$u.http.get(`/api/v1/chat/sessions/${sessionId}/messages`, {}, config)

export const requestOtp = (data, config = {}) => uni.$u.http.post('/api/v1/auth/otp/request', data, config)
export const verifyOtp = (data, config = {}) => uni.$u.http.post('/api/v1/auth/otp/verify', data, config)
export const getMe = (config = {}) => uni.$u.http.get('/api/v1/me', {}, config)


