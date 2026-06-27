/**
 * 请求拦截
 * @param {Object} http
 */
module.exports = (vm) => {
    uni.$u.http.interceptors.request.use((config) => { // 可使用async await 做异步操作
        // 初始化请求拦截器时，会执行此方法，此时data为undefined，赋予默认{}
        config.data = config.data || {}
        config.header = config.header || {}
        
        // 注入 X-Device-ID
        const deviceId = uni.getStorageSync('device_id')
        if (deviceId) {
            config.header['X-Device-ID'] = deviceId
        }
        
        // 注入 Authorization Bearer Token
        const token = uni.getStorageSync('kazi_auth_token')
        if (token) {
            config.header['Authorization'] = `Bearer ${token}`
        }
        
        return config
    }, (config) => // 可使用async await 做异步操作
        Promise.reject(config))
}
