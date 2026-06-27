<template>
	<view class="profile-page">
		<!-- 1. 头像区 -->
		<view class="avatar-section">
			<view class="avatar-wrapper" @tap="mockAvatarUpload">
				<image src="/static/default_avatar.png" mode="aspectFill" class="avatar-img"></image>
				<view class="camera-badge">
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M23 19C23 20.1 22.1 21 21 21H3C1.9 21 1 20.1 1 19V8C1 6.9 1.9 6 3 6H7.14L9 3H15L16.86 6H21C22.1 6 23 6.9 23 8V19Z" fill="currentColor"/>
						<circle cx="12" cy="13" r="4" fill="none" stroke="#FFFFFF" stroke-width="2.5"/>
					</svg>
				</view>
			</view>
		</view>

		<!-- 2. 基本信息卡片 -->
		<view class="form-card">
			<!-- 昵称 -->
			<view class="form-item">
				<text class="form-label">{{ $t('profile.displayNameLabel') }}</text>
				<input type="text" v-model="nickname" class="form-input" :placeholder="$t('profile.displayNamePlaceholder')" placeholder-class="placeholder-style" />
			</view>

			<!-- 国家地区 -->
			<view class="form-item" @tap="showCountryPicker = true">
				<text class="form-label">{{ $t('profile.countryLabel') }}</text>
				<view class="picker-value-row">
					<text class="picker-value">{{ countryNames[countryIndex] }}</text>
					<svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M6 9L12 15L18 9" stroke="#9CA3AF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
				</view>
			</view>

			<!-- 目标岗位 -->
			<view class="form-item">
				<text class="form-label">{{ $t('profile.targetRoleLabel') }}</text>
				<input type="text" v-model="targetRole" class="form-input" :placeholder="$t('profile.targetRolePlaceholder')" placeholder-class="placeholder-style" />
			</view>

			<!-- 当前状态 -->
			<view class="form-item no-border" @tap="showStatusPicker = true">
				<text class="form-label">{{ $t('profile.currentStatusLabel') }}</text>
				<view class="picker-value-row">
					<text class="picker-value">{{ statusNames[statusIndex] }}</text>
					<svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M6 9L12 15L18 9" stroke="#9CA3AF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
				</view>
			</view>
		</view>

		<!-- 3. 求职偏好卡片 -->
		<view class="form-card">
			<!-- 职业目标 -->
			<view class="form-item" @tap="showGoalPicker = true">
				<text class="form-label">{{ $t('profile.careerGoalLabel') }}</text>
				<view class="picker-value-row">
					<text class="picker-value">{{ goalNames[goalIndex] }}</text>
					<svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M6 9L12 15L18 9" stroke="#9CA3AF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
				</view>
			</view>

			<!-- 英语水平 -->
			<view class="form-item no-border" @tap="showEnglishPicker = true">
				<text class="form-label">{{ $t('profile.englishLevelLabel') }}</text>
				<view class="picker-value-row">
					<text class="picker-value">{{ englishOptions[englishIndex] }}</text>
					<svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M6 9L12 15L18 9" stroke="#9CA3AF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
				</view>
			</view>
		</view>

		<!-- 4. 教育与背景卡片 -->
		<view class="form-card">
			<view class="form-item textarea-item">
				<text class="form-label">{{ $t('profile.educationLabel') }}</text>
				<textarea v-model="educationText" class="form-textarea" :placeholder="$t('profile.educationPlaceholder')" placeholder-class="placeholder-style" auto-height></textarea>
			</view>
		</view>

		<view class="form-card">
			<view class="form-item textarea-item no-border">
				<text class="form-label">{{ $t('profile.experienceLabel') }}</text>
				<textarea v-model="experienceText" class="form-textarea" :placeholder="$t('profile.experiencePlaceholder')" placeholder-class="placeholder-style" auto-height></textarea>
			</view>
		</view>

		<!-- 5. 按钮组 -->
		<view class="button-group">
			<button class="save-btn" :loading="isSaving" :disabled="isSaving" @tap="saveProfile">
				<text>{{ $t('profile.saveButton') }}</text>
			</button>
			<button class="cancel-btn" :disabled="isSaving" @tap="cancelEdit">
				<text>{{ $t('profile.cancelButton') }}</text>
			</button>
		</view>

		<!-- uView u-picker 组件 -->
		<u-picker
			:show="showCountryPicker"
			:columns="[countryNames]"
			:defaultIndex="[countryIndex]"
			:cancelText="$t('profile.cancelText')"
			:confirmText="$t('profile.confirmText')"
			@cancel="showCountryPicker = false"
			@confirm="onCountryConfirm"
		></u-picker>

		<u-picker
			:show="showStatusPicker"
			:columns="[statusNames]"
			:defaultIndex="[statusIndex]"
			:cancelText="$t('profile.cancelText')"
			:confirmText="$t('profile.confirmText')"
			@cancel="showStatusPicker = false"
			@confirm="onStatusConfirm"
		></u-picker>

		<u-picker
			:show="showGoalPicker"
			:columns="[goalNames]"
			:defaultIndex="[goalIndex]"
			:cancelText="$t('profile.cancelText')"
			:confirmText="$t('profile.confirmText')"
			@cancel="showGoalPicker = false"
			@confirm="onGoalConfirm"
		></u-picker>

		<u-picker
			:show="showEnglishPicker"
			:columns="[englishOptions]"
			:defaultIndex="[englishIndex]"
			:cancelText="$t('profile.cancelText')"
			:confirmText="$t('profile.confirmText')"
			@cancel="showEnglishPicker = false"
			@confirm="onEnglishConfirm"
		></u-picker>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				nickname: 'Kazi User',
				countryIndex: 0,
				countryOptions: ['kz', 'uz', 'other'],
				goalIndex: 0,
				goalOptions: ['better_job', 'interview_prep', 'cv_build'],
				targetRole: 'Software Engineer',
				englishIndex: 2, // B1
				englishOptions: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
				statusIndex: 2, // job_seeker
				statusOptions: ['student', 'employed', 'job_seeker'],
				educationText: 'Al-Farabi Kazakh National University, Bachelor of Computer Science',
				experienceText: 'Software Engineer Intern at KazTech, developed responsive interfaces and integrated RESTful APIs.',
				isSaving: false,
				
				// 控制 u-picker 弹出状态
				showCountryPicker: false,
				showStatusPicker: false,
				showGoalPicker: false,
				showEnglishPicker: false
			};
		},
		computed: {
			countryNames() {
				return this.countryOptions.map(c => this.$t(`profile.countries.${c}`));
			},
			goalNames() {
				return this.goalOptions.map(g => this.$t(`profile.goals.${g}`));
			},
			statusNames() {
				return this.statusOptions.map(s => this.$t(`profile.statuses.${s}`));
			}
		},
		watch: {
			'$i18n.locale'() {
				this.updateTitle();
			}
		},
		mounted() {
			this.updateTitle();
		},
		methods: {
			updateTitle() {
				uni.setNavigationBarTitle({
					title: this.$t('profile.title')
				});
			},
			onCountryConfirm(e) {
				this.countryIndex = e.indexs[0];
				this.showCountryPicker = false;
			},
			onStatusConfirm(e) {
				this.statusIndex = e.indexs[0];
				this.showStatusPicker = false;
			},
			onGoalConfirm(e) {
				this.goalIndex = e.indexs[0];
				this.showGoalPicker = false;
			},
			onEnglishConfirm(e) {
				this.englishIndex = e.indexs[0];
				this.showEnglishPicker = false;
			},
			mockAvatarUpload() {
				uni.showToast({
					title: 'Upload Photo (Mock)',
					icon: 'none'
				});
			},
			saveProfile() {
				if (!this.nickname.trim()) {
					uni.showToast({
						title: 'Name required',
						icon: 'none'
					});
					return;
				}

				this.isSaving = true;
				// 模拟 800ms 保存动画
				setTimeout(() => {
					this.isSaving = false;
					uni.showToast({
						title: this.$t('profile.saveSuccess'),
						icon: 'success',
						duration: 1500
					});
					setTimeout(() => {
						uni.navigateBack();
					}, 1500);
				}, 800);
			},
			cancelEdit() {
				uni.navigateBack();
			}
		}
	};
</script>

<style lang="scss" scoped>
	.profile-page {
		min-height: 100vh;
		background-color: #f9fafb;
		padding-top: 30rpx;
		padding-bottom: 80rpx;
		font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
		box-sizing: border-box;
	}

	/* 1. 头像样式 */
	.avatar-section {
		display: flex;
		justify-content: center;
		margin-bottom: 40rpx;
		
		.avatar-wrapper {
			position: relative;
			width: 160rpx;
			height: 160rpx;
			box-sizing: border-box;
			
			.avatar-img {
				width: 100%;
				height: 100%;
				border-radius: 50%;
				border: 6rpx solid #ffffff;
				box-shadow: 0 4rpx 15rpx rgba(0, 0, 0, 0.08);
				background-color: #f3f4f6;
				box-sizing: border-box;
			}
			
			.camera-badge {
				position: absolute;
				bottom: 0;
				right: 0;
				width: 48rpx;
				height: 48rpx;
				background-color: #2563eb;
				border-radius: 50%;
				border: 4rpx solid #ffffff;
				display: flex;
				align-items: center;
				justify-content: center;
				color: #ffffff;
				box-shadow: 0 2rpx 8rpx rgba(37, 99, 235, 0.3);
				box-sizing: border-box;
			}
		}
	}

	/* 2. 表单卡片 */
	.form-card {
		background-color: #ffffff;
		border-radius: 24rpx;
		margin: 0 30rpx 30rpx 30rpx;
		padding: 10rpx 30rpx;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.015);
	}

	.form-item {
		display: flex;
		flex-direction: column;
		padding: 28rpx 0;
		border-bottom: 1rpx solid #f3f4f6;
		
		&.no-border {
			border-bottom: none;
		}
		
		.form-label {
			font-size: 24rpx;
			color: #9ca3af;
			font-weight: 700;
			text-transform: uppercase;
			letter-spacing: 0.5rpx;
			margin-bottom: 12rpx;
		}
		
		.form-input {
			font-size: 29rpx;
			color: #1f2937;
			height: 50rpx;
			line-height: 50rpx;
			font-weight: 500;
		}
		
		.picker-value-row {
			display: flex;
			align-items: center;
			justify-content: space-between;
			height: 50rpx;
			
			.picker-value {
				font-size: 29rpx;
				color: #1f2937;
				font-weight: 500;
			}
		}

		&.textarea-item {
			border-bottom: none;
		}

		.form-textarea {
			font-size: 29rpx;
			color: #1f2937;
			min-height: 120rpx;
			width: 100%;
			font-weight: 500;
			line-height: 1.5;
			padding-top: 6rpx;
		}
	}

	.placeholder-style {
		color: #d1d5db;
		font-weight: 400;
	}

	/* 3. 按钮组 */
	.button-group {
		margin: 50rpx 30rpx 0 30rpx;
		display: flex;
		flex-direction: column;
		gap: 20rpx;
		
		.save-btn {
			width: 100%;
			height: 90rpx;
			background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
			border-radius: 20rpx;
			color: #ffffff;
			font-size: 28rpx;
			font-weight: 700;
			display: flex;
			align-items: center;
			justify-content: center;
			border: none;
			box-shadow: 0 6rpx 18rpx rgba(37, 99, 235, 0.2);
			transition: all 0.2s ease;
			
			&:active {
				opacity: 0.95;
				transform: translateY(1rpx);
			}
			
			&[disabled] {
				opacity: 0.6;
			}
		}
		
		.cancel-btn {
			width: 100%;
			height: 90rpx;
			background-color: #ffffff;
			border: 1rpx solid #e5e7eb;
			border-radius: 20rpx;
			color: #4b5563;
			font-size: 28rpx;
			font-weight: 600;
			display: flex;
			align-items: center;
			justify-content: center;
			transition: all 0.2s ease;
			
			&:active {
				background-color: #f9fafb;
			}
			
			&[disabled] {
				opacity: 0.6;
			}
		}
	}
</style>
