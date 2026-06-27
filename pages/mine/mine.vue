<template>
	<view class="mine-page">
		<!-- 1. 用户基本信息卡片 -->
		<view class="profile-card" @tap="editProfile">
			<image src="/static/default_avatar.png" mode="aspectFill" class="profile-avatar"></image>
			<view class="profile-meta">
				<view class="name-row">
					<text class="username">{{ usernameDisplay }}</text>
					<text class="plan-badge" :class="userPlanClass">{{ translatedUserPlan }}</text>
				</view>
				<text class="user-sub">{{ phoneDisplay }} · {{ country }}</text>
			</view>
			<!-- 右侧编辑箭头 -->
			<view class="arrow-icon">
				<svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M9 5L16 12L9 19" stroke="#9CA3AF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
			</view>
		</view>

		<!-- 2. 资产与额度仪表盘 -->
		<view class="credits-dashboard-card">
			<view class="credits-grid">
				<view class="credit-item">
					<view class="value-row">
						<text class="credit-value">{{ cvCredits }}</text>
						<text class="credit-total">/{{ maxCvCredits }}</text>
					</view>
					<text class="credit-label">{{ $t('mine.cvCreditsLabel') }}</text>
				</view>
				<view class="divider-line"></view>
				<view class="credit-item">
					<text class="credit-value">{{ interviewCredits }}</text>
					<text class="credit-label">{{ $t('mine.mockInterviewsLabel') }}</text>
				</view>
				<view class="divider-line"></view>
				<view class="credit-item">
					<view class="value-row">
						<text class="credit-value">{{ streakDays }}</text>
						<text class="credit-unit">{{ $t('mine.streakUnit') }}</text>
					</view>
					<text class="credit-label">{{ $t('mine.streakLabel') }}</text>
				</view>
			</view>
			<button class="upgrade-btn" @tap="upgradePlan">
				<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="btn-icon">
					<path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#FFFFFF" stroke="#FFFFFF" stroke-width="2" stroke-linejoin="round"/>
					<path d="M2 17L12 22L22 17" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M2 12L12 17L22 12" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
				<text>{{ $t('mine.upgradeButton') }}</text>
			</button>
		</view>

		<!-- 3. 菜单分组 1: 求职与学习 -->
		<view class="menu-card-group">
			<view class="group-title">{{ $t('mine.jobPrepGroupTitle') }}</view>
			
			<!-- 我的简历仓库 -->
			<view class="menu-item" @tap="navigateTo('cv')">
				<view class="menu-item-left">
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="menu-icon">
						<path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" fill="#3B82F6"/>
						<path d="M14 2V8H20" fill="#2563EB" opacity="0.3"/>
						<path d="M16 13H8V15H16V13ZM16 17H8V19H16V17ZM12 9H8V11H12V9Z" fill="#FFFFFF"/>
					</svg>
					<text class="menu-label">{{ $t('mine.cvRepoLabel') }}</text>
				</view>
				<view class="menu-item-right">
					<text class="menu-value highlighted">{{ $t('mine.cvRepoValue') }}</text>
					<svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M9 5L16 12L9 19" stroke="#9CA3AF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
				</view>
			</view>

			<!-- 模拟面试记录 -->
			<view class="menu-item" @tap="navigateTo('interview')">
				<view class="menu-item-left">
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="menu-icon">
						<path d="M12 14C14.21 14 16 12.21 16 10V5C16 2.79 14.21 1 12 1C9.79 1 8 2.79 8 5V10C8 12.21 9.79 14 12 14Z" fill="#10B981"/>
						<path d="M19 10H17C17 12.76 14.76 15 12 15C9.24 15 7 12.76 7 10H5C5 13.41 7.72 16.23 11 16.93V20H13V16.93C16.28 16.23 19 13.41 19 10Z" fill="#059669"/>
					</svg>
					<text class="menu-label">{{ $t('mine.interviewRecordsLabel') }}</text>
				</view>
				<view class="menu-item-right">
					<text class="menu-value">{{ $t('mine.interviewRecordsValue') }}</text>
					<svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M9 5L16 12L9 19" stroke="#9CA3AF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
				</view>
			</view>

			<!-- 每日求职任务 -->
			<view class="menu-item" @tap="navigateTo('sprint')">
				<view class="menu-item-left">
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="menu-icon">
						<path d="M19 3H18V1H16V3H8V1H6V3H5C3.9 3 2.9 3.9 2.9 5L2.9 20C2.9 21.1 3.9 22 5 22H19C20.1 22 21.1 21.1 21.1 20V5C21.1 3.9 20.1 3 19 3ZM19 20H5V9H19V20ZM12 11H7V16H12V11Z" fill="#8B5CF6"/>
					</svg>
					<text class="menu-label">{{ $t('mine.dailyTasksLabel') }}</text>
				</view>
				<view class="menu-item-right">
					<view class="badge-dot"></view>
					<text class="menu-value pending">{{ $t('mine.dailyTasksValue') }}</text>
					<svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M9 5L16 12L9 19" stroke="#9CA3AF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
				</view>
			</view>
		</view>

		<!-- 4. 菜单分组 2: 求职偏好与档案 -->
		<view class="menu-card-group">
			<view class="group-title">{{ $t('mine.profilePreferencesGroupTitle') }}</view>
			
			<!-- 期望岗位与背景 -->
			<view class="menu-item" @tap="navigateTo('profile-role')">
				<view class="menu-item-left">
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="menu-icon">
						<path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 6C13.66 6 15 7.34 15 9C15 10.66 13.66 12 12 12C10.34 12 9 10.66 9 9C9 7.34 10.34 6 12 6ZM12 20.2C9.3 20.2 6.9 18.8 5.5 16.7C5.54 14.7 9.5 13.6 12 13.6C14.5 13.6 18.46 14.7 18.5 16.7C17.1 18.8 14.7 20.2 12 20.2Z" fill="#F59E0B"/>
					</svg>
					<text class="menu-label">{{ $t('mine.targetRoleLabel') }}</text>
				</view>
				<view class="menu-item-right">
					<text class="menu-value">IT Support (B1)</text>
					<svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M9 5L16 12L9 19" stroke="#9CA3AF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
				</view>
			</view>

			<!-- 职业准备计划 -->
			<view class="menu-item" @tap="navigateTo('profile-goals')">
				<view class="menu-item-left">
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="menu-icon">
						<path d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2ZM16.2 16.2L11 13V7H12.5V12.2L17 14.9L16.2 16.2Z" fill="#10B981"/>
					</svg>
					<text class="menu-label">{{ $t('mine.sprintPlanLabel') }}</text>
				</view>
				<view class="menu-item-right">
					<text class="menu-value">{{ $t('mine.sprintPlanValue') }}</text>
					<svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M9 5L16 12L9 19" stroke="#9CA3AF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
				</view>
			</view>

			<!-- 绑定 Telegram 账号 -->
			<view class="menu-item" @tap="bindTelegram">
				<view class="menu-item-left">
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="menu-icon">
						<path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM16.64 8.76L14.97 16.63C14.85 17.18 14.52 17.31 14.06 17.05L11.52 15.18L10.29 16.36C10.16 16.5 10.04 16.61 9.78 16.61L9.96 13.99L14.73 9.68C14.94 9.49 14.68 9.38 14.4 9.57L8.5 13.28L5.97 12.49C5.42 12.32 5.41 11.94 6.08 11.68L15.98 7.86C16.44 7.69 16.84 7.96 16.64 8.76Z" fill="#3B82F6"/>
					</svg>
					<text class="menu-label">{{ $t('mine.bindTelegramLabel') }}</text>
				</view>
				<view class="menu-item-right">
					<text class="menu-value" :class="isTelegramLinked ? 'linked' : 'unlinked'">{{ isTelegramLinked ? $t('mine.tgLinked') : $t('mine.tgUnlinked') }}</text>
					<svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M9 5L16 12L9 19" stroke="#9CA3AF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
				</view>
			</view>
		</view>

		<!-- 5. 菜单分组 3: 账单与服务 -->
		<view class="menu-card-group">
			<view class="group-title">{{ $t('mine.billingServicesGroupTitle') }}</view>

			<!-- 订阅方案 -->
			<view class="menu-item" @tap="navigateTo('subscription')">
				<view class="menu-item-left">
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="menu-icon">
						<path d="M21 18V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V5C3 3.9 3.9 3 5 3H19C20.1 3 21 3.9 21 5V6H12C10.9 6 10 6.9 10 8V16C10 17.1 10.9 18 12 18H21ZM12 16H22V8H12V16ZM16 13.5C15.17 13.5 14.5 12.83 14.5 12C14.5 11.17 15.17 10.5 16 10.5C16.83 10.5 17.5 11.17 17.5 12C17.5 12.83 16.83 13.5 16 13.5Z" fill="#EC4899"/>
					</svg>
					<text class="menu-label">{{ $t('mine.subscriptionPlansLabel') }}</text>
				</view>
				<view class="menu-item-right">
					<text class="menu-value">{{ translatedUserPlan }}</text>
					<svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M9 5L16 12L9 19" stroke="#9CA3AF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
				</view>
			</view>

			<!-- 购买点数 / 充值 -->
			<view class="menu-item" @tap="navigateTo('credits')">
				<view class="menu-item-left">
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="menu-icon">
						<path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM11 7H13V13H11V7ZM11 15H13V17H11V15Z" fill="#F59E0B"/>
					</svg>
					<text class="menu-label">{{ $t('mine.buyCreditsLabel') }}</text>
				</view>
				<view class="menu-item-right">
					<svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M9 5L16 12L9 19" stroke="#9CA3AF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
				</view>
			</view>

			<!-- 额度消费流水 -->
			<view class="menu-item" @tap="navigateTo('ledger')">
				<view class="menu-item-left">
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="menu-icon">
						<path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19ZM7 10H9V12H7V10ZM7 6H17V8H7V6ZM7 14H17V16H7V14ZM11 10H17V12H11V10Z" fill="#4B5563"/>
					</svg>
					<text class="menu-label">{{ $t('mine.creditsLedgerLabel') }}</text>
				</view>
				<view class="menu-item-right">
					<svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M9 5L16 12L9 19" stroke="#9CA3AF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
				</view>
			</view>
		</view>

		<!-- 6. 菜单分组 4: 系统设置 -->
		<view class="menu-card-group">
			<view class="group-title">{{ $t('mine.systemSettingsGroupTitle') }}</view>

			<!-- 界面语言 -->
			<view class="menu-item" @tap="changeLanguage">
				<view class="menu-item-left">
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="menu-icon">
						<path d="M12.87 15.07L10.33 12.56L10.36 12.53C12.1 10.59 13.34 8.36 14.07 6H17V4H10V2H8V4H1V6H12.17C11.5 7.92 10.44 9.75 9 11.35C8.07 10.32 7.3 9.19 6.69 8H4.69C5.42 9.63 6.42 11.17 7.67 12.56L2.58 17.58L4 19L9 14L12.11 17.11L12.87 15.07ZM18.5 10H16.5L12 22H14L15.12 19H19.87L21 22H23L18.5 10ZM15.88 17L17.5 12.67L19.12 17H15.88Z" fill="#3B82F6"/>
					</svg>
					<text class="menu-label">{{ $t('mine.interfaceLanguageLabel') }}</text>
				</view>
				<view class="menu-item-right">
					<text class="menu-value">{{ currentLanguageLabel }}</text>
					<svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M9 5L16 12L9 19" stroke="#9CA3AF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
				</view>
			</view>

			<!-- 震动反馈 -->
			<view class="menu-item">
				<view class="menu-item-left">
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="menu-icon">
						<path d="M12 3v18M8 6v12M4 9v6M16 6v12M20 9v6" stroke="#8B5CF6" stroke-width="2" stroke-linecap="round"/>
					</svg>
					<text class="menu-label">{{ $t('mine.hapticFeedbackLabel') }}</text>
				</view>
				<view class="menu-item-right" style="padding-right: 0;">
					<switch color="#2563eb" :checked="hapticFeedback" @change="toggleHaptic" class="scale-switch" />
				</view>
			</view>

			<!-- 退出登录 -->
			<view class="menu-item" @tap="handleLogout">
				<view class="menu-item-left">
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="menu-icon">
						<path d="M10.09 15.59L11.5 17L16.5 12L11.5 7L10.09 8.41L12.67 11H3V13H12.67L10.09 15.59ZM19 3H5C3.89 3 3 3.9 3 5V9H5V5H19V19H5V15H3V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3Z" fill="#EF4444"/>
					</svg>
					<text class="menu-label logout-text">{{ $t('mine.logoutLabel') }}</text>
				</view>
				<view class="menu-item-right">
					<svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M9 5L16 12L9 19" stroke="#EF4444" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
				</view>
			</view>
		</view>

		<!-- uView Custom Action Sheet for Language Switching to support fully translated Cancel button across H5/App/Web -->
		<u-action-sheet
			:actions="languageActions"
			:cancelText="$t('mine.confirmCancel')"
			:show="showLanguageSheet"
			:round="12"
			@close="showLanguageSheet = false"
			@select="selectLanguage"
		></u-action-sheet>
	</view>
</template>

<script>
	import { mapState } from 'vuex';

	export default {
		data() {
			return {
				country: 'Kazakhstan (KZ)',
				cvCredits: 1,
				maxCvCredits: 2,
				interviewCredits: 1,
				streakDays: 3,
				hapticFeedback: true,
				isTelegramLinked: false,
				showLanguageSheet: false,
				languageActions: [
					{ name: 'Русский (Russian)', lang: 'ru' },
					{ name: 'Қазақша (Kazakh)', lang: 'kk' },
					{ name: 'Oʻzbekcha (Uzbek)', lang: 'uz' },
					{ name: 'English', lang: 'en' }
				]
			};
		},
		computed: {
			...mapState(['isLoggedIn', 'userInfo']),
			usernameDisplay() {
				return this.isLoggedIn ? (this.userInfo.display_name || this.userInfo.user_id || 'User') : 'Guest';
			},
			phoneDisplay() {
				return this.isLoggedIn ? (this.userInfo.phone || '+7 701 *** 8899') : '+7 701 *** 8899';
			},
			translatedUserPlan() {
				if (this.isLoggedIn) {
					if (this.userInfo.plan === 'pro') {
						return this.$t('mine.proBadge');
					} else if (this.userInfo.plan === 'sprint') {
						return this.$t('mine.sprintBadge');
					}
				}
				return this.$t('mine.freeTrialBadge');
			},
			userPlanClass() {
				if (this.isLoggedIn) {
					if (this.userInfo.plan === 'pro') return 'plan-pro';
					if (this.userInfo.plan === 'sprint') return 'plan-sprint';
				}
				return 'plan-free';
			},
			currentLanguageLabel() {
				const lang = this.$i18n.locale;
				const map = {
					en: 'English',
					ru: 'Русский (Russian)',
					kk: 'Қазақша (Kazakh)',
					uz: 'Oʻzbekcha (Uzbek)'
				};
				return map[lang] || 'English';
			}
		},
		watch: {
			'$i18n.locale'() {
				this.updateTitle();
			}
		},
		onShow() {
			this.loadCredits();
		},
		mounted() {
			this.updateTitle();
			this.loadCredits();
		},
		methods: {
			updateTitle() {
				uni.setNavigationBarTitle({
					title: this.$t('mine.title')
				});
			},
			loadCredits() {
				const cv = uni.getStorageSync('kazi_cv_credits');
				const maxCv = uni.getStorageSync('kazi_max_cv_credits');
				const interview = uni.getStorageSync('kazi_interview_credits');
				
				if (cv !== '') this.cvCredits = Number(cv);
				else this.cvCredits = 1;
				
				if (maxCv !== '') this.maxCvCredits = Number(maxCv);
				else this.maxCvCredits = 2;
				
				if (interview !== '') this.interviewCredits = Number(interview);
				else this.interviewCredits = 1;
			},
			editProfile() {
				uni.navigateTo({
					url: '/pages/profile/profile'
				});
			},
			upgradePlan() {
				uni.navigateTo({
					url: '/pages/billing/subscription'
				});
			},
			navigateTo(target) {
				if (target === 'subscription') {
					uni.navigateTo({
						url: '/pages/billing/subscription'
					});
					return;
				}
				if (target === 'credits') {
					uni.navigateTo({
						url: '/pages/billing/credits'
					});
					return;
				}
				if (target === 'ledger') {
					uni.navigateTo({
						url: '/pages/billing/ledger'
					});
					return;
				}
				let titles = {
					'cv': this.$t('mine.cvLoading'),
					'interview': this.$t('mine.interviewLoading'),
					'sprint': this.$t('mine.sprintLoading'),
					'profile-role': this.$t('mine.profileRoleLoading'),
					'profile-goals': this.$t('mine.profileGoalsLoading'),
					'billing': this.$t('mine.billingLoading'),
					'ledger': this.$t('mine.ledgerLoading')
				};
				uni.showToast({
					title: titles[target] || `Loading: ${target}`,
					icon: 'none'
				});
			},
			bindTelegram() {
				uni.showToast({
					title: this.$t('mine.tgLinkingToast'),
					icon: 'none'
				});
			},
			changeLanguage() {
				this.showLanguageSheet = true;
			},
			selectLanguage(action) {
				const langCode = action.lang;
				const selectedName = action.name;
				this.$i18n.locale = langCode;
				uni.setStorageSync('kazi_language', langCode);
				uni.showToast({
					title: this.$t('mine.langChangedToast', { lang: selectedName }),
					icon: 'success'
				});
			},
			toggleHaptic(e) {
				this.hapticFeedback = e.detail.value;
				if (this.hapticFeedback) {
					uni.vibrateShort({
						success: () => {
							console.log('Haptic feedback vibrated');
						}
					});
				}
			},
			handleLogout() {
				uni.showModal({
					title: this.$t('mine.logoutConfirmTitle'),
					content: this.$t('mine.logoutConfirmContent'),
					confirmText: this.$t('mine.confirmOk'),
					cancelText: this.$t('mine.confirmCancel'),
					success: (res) => {
						if (res.confirm) {
							this.$store.dispatch('logout');
							uni.showToast({
								title: this.$t('mine.logoutToast'),
								icon: 'success'
							});
							setTimeout(() => {
								uni.reLaunch({
									url: '/pages/login/login'
								});
							}, 800);
						}
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	.mine-page {
		min-height: 100vh;
		background-color: #f9fafb;
		padding-top: 20rpx;
		padding-bottom: 50rpx;
		font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
	}

	/* 1. 用户资料卡片样式 */
	.profile-card {
		display: flex;
		align-items: center;
		background-color: #ffffff;
		border-radius: 24rpx;
		padding: 40rpx 30rpx;
		margin: 30rpx;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.015);
		position: relative;
		
		&:active {
			background-color: #f9fafb;
		}

		.profile-avatar {
			width: 110rpx;
			height: 110rpx;
			border-radius: 55rpx;
			border: 4rpx solid #e5e7eb;
			background-color: #f3f4f6;
			margin-right: 30rpx;
		}

		.profile-meta {
			display: flex;
			flex-direction: column;
			flex: 1;
			
			.name-row {
				display: flex;
				align-items: center;
				
				.username {
					font-size: 34rpx;
					font-weight: 700;
					color: #111827;
				}
				
				.plan-badge {
					margin-left: 16rpx;
					font-size: 20rpx;
					font-weight: 600;
					padding: 4rpx 12rpx;
					border-radius: 8rpx;
					
					&.plan-free {
						color: #6b7280;
						background-color: rgba(107, 114, 128, 0.1);
					}
					&.plan-pro {
						color: #2563eb;
						background-color: rgba(37, 99, 235, 0.1);
					}
					&.plan-sprint {
						color: #8b5cf6;
						background-color: rgba(139, 92, 246, 0.1);
					}
				}
			}
			
			.user-sub {
				font-size: 24rpx;
				color: #6b7280;
				margin-top: 10rpx;
			}
		}

		.arrow-icon {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 40rpx;
			height: 40rpx;
		}
	}

	/* 2. 资产与额度卡片样式 */
	.credits-dashboard-card {
		background-color: #ffffff;
		border-radius: 24rpx;
		padding: 30rpx;
		margin: 0 30rpx 30rpx 30rpx;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.015);

		.credits-grid {
			display: flex;
			align-items: center;
			justify-content: space-around;
			padding: 10rpx 0;
			
			.credit-item {
				display: flex;
				flex-direction: column;
				align-items: center;
				flex: 1;
				
				.value-row {
					display: flex;
					align-items: baseline;
				}
				
				.credit-value {
					font-size: 40rpx;
					font-weight: 800;
					color: #1f2937;
				}
				
				.credit-total {
					font-size: 24rpx;
					color: #9ca3af;
					font-weight: 500;
				}
				
				.credit-unit {
					font-size: 22rpx;
					color: #1f2937;
					margin-left: 4rpx;
					font-weight: 600;
				}
				
				.credit-label {
					font-size: 22rpx;
					color: #9ca3af;
					margin-top: 10rpx;
					font-weight: 500;
				}
			}
			
			.divider-line {
				width: 1rpx;
				height: 60rpx;
				background-color: #f3f4f6;
			}
		}

		.upgrade-btn {
			width: 100%;
			height: 84rpx;
			background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
			border-radius: 18rpx;
			color: #ffffff;
			font-size: 26rpx;
			font-weight: 700;
			display: flex;
			align-items: center;
			justify-content: center;
			margin-top: 30rpx;
			border: none;
			box-shadow: 0 6rpx 15rpx rgba(37, 99, 235, 0.15);
			
			.btn-icon {
				margin-right: 12rpx;
				display: flex;
				align-items: center;
			}
			
			&:active {
				opacity: 0.95;
			}
		}
	}

	/* 3. 菜单列表分组样式 */
	.menu-card-group {
		background-color: #ffffff;
		border-radius: 24rpx;
		margin: 0 30rpx 30rpx 30rpx;
		padding: 20rpx 30rpx 10rpx 30rpx;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.015);
		
		.group-title {
			font-size: 22rpx;
			font-weight: 700;
			color: #9ca3af;
			text-transform: uppercase;
			letter-spacing: 1rpx;
			margin-bottom: 10rpx;
			padding-left: 2rpx;
		}
	}

	.menu-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 34rpx 0;
		border-bottom: 1rpx solid #f3f4f6;
		
		&:last-child {
			border-bottom: none;
		}
		
		&:active:not(:has(switch)) {
			background-color: #f9fafb;
		}

		.menu-item-left {
			display: flex;
			align-items: center;
			
			.menu-icon {
				margin-right: 22rpx;
				display: flex;
				align-items: center;
				justify-content: center;
			}
			
			.menu-label {
				font-size: 29rpx;
				color: #1f2937;
				font-weight: 500;
				
				&.logout-text {
					color: #ef4444;
					font-weight: 600;
				}
			}
		}

		.menu-item-right {
			display: flex;
			align-items: center;
			padding-right: 10rpx;
			
			.menu-value {
				font-size: 26rpx;
				color: #9ca3af;
				margin-right: 12rpx;
				
				&.highlighted {
					color: #2563eb;
					font-weight: 600;
				}
				
				&.pending {
					color: #8b5cf6;
					font-weight: 600;
				}
				
				&.unlinked {
					color: #f59e0b;
					font-weight: 600;
				}
				
				&.linked {
					color: #10b981;
					font-weight: 600;
				}
			}

			.badge-dot {
				width: 12rpx;
				height: 12rpx;
				background-color: #ef4444;
				border-radius: 6rpx;
				margin-right: 10rpx;
			}
		}
	}

	.scale-switch {
		transform: scale(0.85);
		transform-origin: right center;
	}
</style>