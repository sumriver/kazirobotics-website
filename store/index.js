import Vue from 'vue'
import Vuex from 'vuex'
import { verifyOtp, getMe } from '@/common/api.js'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		token: uni.getStorageSync('kazi_auth_token') || '',
		userInfo: {},
		isLoggedIn: !!uni.getStorageSync('kazi_auth_token')
	},
	mutations: {
		SET_TOKEN(state, token) {
			state.token = token;
			state.isLoggedIn = !!token;
			if (token) {
				uni.setStorageSync('kazi_auth_token', token);
			} else {
				uni.removeStorageSync('kazi_auth_token');
			}
		},
		SET_USER_INFO(state, userInfo) {
			state.userInfo = userInfo || {};
		},
		CLEAR_AUTH(state) {
			state.token = '';
			state.userInfo = {};
			state.isLoggedIn = false;
			uni.removeStorageSync('kazi_auth_token');
		}
	},
	actions: {
		async login({ commit }, payload) {
			try {
				const res = await verifyOtp(payload);
				if (res && res.access_token) {
					commit('SET_TOKEN', res.access_token);
					commit('SET_USER_INFO', res.user);
					return res;
				}
				throw new Error('Login failed: no access token in response');
			} catch (e) {
				console.error('Store login action error:', e);
				throw e;
			}
		},
		async fetchUserProfile({ commit }) {
			try {
				const res = await getMe();
				if (res) {
					commit('SET_USER_INFO', res);
					return res;
				}
			} catch (e) {
				console.error('Store fetchUserProfile action error:', e);
				if (e.statusCode === 401 || (e.data && e.data.error_code === 'UNAUTHORIZED')) {
					commit('CLEAR_AUTH');
				}
				throw e;
			}
		},
		logout({ commit }) {
			commit('CLEAR_AUTH');
		}
	}
})

export default store
