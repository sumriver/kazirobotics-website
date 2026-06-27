import Vue from 'vue'
import VueI18n from 'vue-i18n'
import en from './en.json'
import ru from './ru.json'
import kk from './kk.json'
import uz from './uz.json'

Vue.use(VueI18n)

const i18n = new VueI18n({
	locale: uni.getStorageSync('kazi_language') || 'en',
	fallbackLocale: 'en',
	messages: {
		en,
		ru,
		kk,
		uz
	}
})

export default i18n
