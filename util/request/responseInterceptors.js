/**
 * 响应拦截
 * @param {Object} http 
 */
module.exports = (vm) => {
    uni.$u.http.interceptors.response.use((response) => { /* 对响应成功做点什么 可使用async await 做异步操作*/
        const data = response.data
        // 自定义参数
        const custom = response.config?.custom
        
        // 兼容处理：只有当后端显式返回了自定义的业务 code 字段且不等于 200 时，才判定为失败
        if (data && data.code !== undefined) {
            if (data.code !== 200) {
                if (custom?.toast !== false) {
                    uni.$u.toast(data.message || 'Operation failed')
                }
                return custom?.catch ? Promise.reject(data) : new Promise(() => { })
            }
            return data.data || {}
        }
        
        // 直接返回 FastAPI 的裸 JSON 数据
        return data
    }, (response) => { /* 对响应错误做点什么 （statusCode !== 2xx）*/
        const data = response.data
        const custom = response.config?.custom
        
        // 401: 登录失效，全局弹窗提示是否重新登录
        if (response.statusCode === 401) {
            vm.$store.dispatch('logout')
            
            // 使用全局变量防止在发起多个并发请求时，重复弹出模态框
            if (!uni.$_isShowing401Modal) {
                uni.$_isShowing401Modal = true
                uni.showModal({
                    title: vm.$t('login.sessionExpiredTitle') || 'Session Expired',
                    content: vm.$t('login.sessionExpiredContent') || 'Your session has expired. Please log in again.',
                    confirmText: vm.$t('login.reLogin') || 'Re-login',
                    cancelText: vm.$t('login.cancel') || 'Cancel',
                    success: (res) => {
                        uni.$_isShowing401Modal = false
                        if (res.confirm) {
                            uni.reLaunch({
                                url: '/pages/login/login'
                            })
                        }
                    },
                    fail: () => {
                        uni.$_isShowing401Modal = false
                    }
                })
            }
            return Promise.reject(data || response)
        }
        
        let errMsg = 'Server is busy, please try again later'
        if (data) {
            // 提取 FastAPI 错误消息 (通常在 detail 中，也可能在 message 中)
            if (typeof data.detail === 'string') {
                errMsg = data.detail
            } else if (data.message) {
                errMsg = data.message
            } else if (Array.isArray(data.detail) && data.detail.length > 0) {
                errMsg = data.detail[0].msg || errMsg
            }
        }
        
        if (custom?.toast !== false) {
            uni.$u.toast(errMsg)
        }
        
        return Promise.reject(data || response)
    })
}