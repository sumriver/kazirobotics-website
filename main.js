import Vue from 'vue'
import App from './App'

// vuex
import store from './store'
import i18n from './locale'

// 引入全局uView
import uView from '@/uni_modules/uview-ui'

import mixin from './common/mixin'

Vue.prototype.$store = store

// Global variable getter for window height to avoid hardcoded vh layout issues.
// Uses Object.defineProperty to calculate dynamically when accessed.
// Note: uni.getWindowInfo().windowHeight already excludes navigationBar and tabBar heights.
Object.defineProperty(Vue.prototype, '$windowHeight', {
	get() {
		try {
			const sysInfo = uni.getWindowInfo();
			return sysInfo.windowHeight;
		} catch (e) {
			try {
				const sysInfo = uni.getSystemInfoSync();
				return sysInfo.windowHeight;
			} catch (err) {
				return 0;
			}
		}
	}
});

Vue.config.productionTip = false

App.mpType = 'app'
Vue.use(uView)

// #ifdef MP
// 引入uView对小程序分享的mixin封装
const mpShare = require('@/uni_modules/uview-ui/libs/mixin/mpShare.js')
Vue.mixin(mpShare)
// #endif

Vue.mixin(mixin)

const app = new Vue({
    store,
    i18n,
    ...App
})

// 引入请求封装
require('./util/request/index')(app)

app.$mount()
