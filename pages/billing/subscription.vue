<template>
	<view class="subscription-page">
		<!-- 1. 方案大分类 Tab 切换 -->
		<view class="tab-container">
			<view 
				class="tab-item" 
				:class="{ active: activeTab === 'pro' }" 
				@tap="switchTab('pro')"
			>
				<text class="tab-title">{{ $t('billing.proTab') }}</text>
				<text class="tab-subtitle">Unlimited Access</text>
			</view>
			<view 
				class="tab-item" 
				:class="{ active: activeTab === 'sprint' }" 
				@tap="switchTab('sprint')"
			>
				<text class="tab-title">{{ $t('billing.sprintTab') }}</text>
				<text class="tab-subtitle">Structured Goals</text>
			</view>
		</view>

		<!-- 2. 板块介绍 -->
		<view class="intro-box">
			<text class="intro-desc">
				{{ activeTab === 'pro' ? $t('billing.proTabDesc') : $t('billing.sprintTabDesc') }}
			</text>
		</view>

		<!-- 3. 商品选项卡列表 -->
		<view v-if="activeTab === 'pro'" class="cards-list">
			<!-- Pro Monthly Card -->
			<view 
				class="pricing-card" 
				:class="{ selected: selectedOption === 'pro_monthly' }"
				@tap="selectOption('pro_monthly')"
			>
				<view class="card-header">
					<text class="package-name">{{ $t('billing.proMonthlyName') }}</text>
				</view>
				<view class="price-row">
					<text class="currency">$</text>
					<text class="price">6.99</text>
					<text class="unit">/ {{ $t('billing.billedAnnually').includes('год') || $t('billing.billedAnnually').includes('yillik') ? 'mo' : 'mo' }}</text>
				</view>
				<text class="card-desc">Billed monthly, cancel anytime</text>
			</view>

			<!-- Pro Annual Card -->
			<view 
				class="pricing-card premium-badge-card" 
				:class="{ selected: selectedOption === 'pro_annual' }"
				@tap="selectOption('pro_annual')"
			>
				<view class="badge-tag">{{ $t('billing.savePercentage') }}</view>
				<view class="card-header">
					<text class="package-name">{{ $t('billing.proAnnualName') }}</text>
				</view>
				<view class="price-row">
					<text class="currency">$</text>
					<text class="price">49.99</text>
					<text class="unit">/ yr</text>
				</view>
				<text class="card-desc">{{ $t('billing.billedAnnually') }}</text>
			</view>
		</view>

		<view v-else class="cards-list">
			<!-- Sprint 7 Days -->
			<view 
				class="pricing-card" 
				:class="{ selected: selectedOption === 'sprint_7d' }"
				@tap="selectOption('sprint_7d')"
			>
				<view class="card-header">
					<text class="package-name">{{ $t('billing.sprint7dName') }}</text>
				</view>
				<view class="price-row">
					<text class="currency">$</text>
					<text class="price">4.99</text>
				</view>
				<text class="card-desc">{{ $t('billing.sprint7dDesc') }}</text>
			</view>

			<!-- Sprint 14 Days -->
			<view 
				class="pricing-card" 
				:class="{ selected: selectedOption === 'sprint_14d' }"
				@tap="selectOption('sprint_14d')"
			>
				<view class="card-header">
					<text class="package-name">{{ $t('billing.sprint14dName') }}</text>
				</view>
				<view class="price-row">
					<text class="currency">$</text>
					<text class="price">9.99</text>
				</view>
				<text class="card-desc">{{ $t('billing.sprint14dDesc') }}</text>
			</view>

			<!-- Sprint 28 Days (Locked) -->
			<view class="pricing-card locked-card">
				<view class="badge-tag locked-tag">Coming Soon</view>
				<view class="card-header">
					<text class="package-name">{{ $t('billing.sprint28dName') }}</text>
				</view>
				<view class="price-row">
					<text class="currency">$</text>
					<text class="price">19.99</text>
				</view>
				<text class="card-desc">{{ $t('billing.sprint28dDesc') }}</text>
			</view>
		</view>

		<!-- 4. 权益清单对比 (Free vs PRO) -->
		<view class="features-comparison">
			<view class="section-title">Features & Privileges</view>
			
			<view class="feature-item">
				<view class="feature-label-col">
					<text class="feature-name">Resume Generation & Optimization</text>
				</view>
				<view class="feature-values">
					<view class="val-col">
						<text class="free-text">{{ $t('billing.freeFeature1') }}</text>
					</view>
					<view class="val-col">
						<text class="pro-text highlight">{{ $t('billing.proFeature1') }}</text>
					</view>
				</view>
			</view>

			<view class="feature-item">
				<view class="feature-label-col">
					<text class="feature-name">AI Mock Interview Practice</text>
				</view>
				<view class="feature-values">
					<view class="val-col">
						<text class="free-text">{{ $t('billing.freeFeature2') }}</text>
					</view>
					<view class="val-col">
						<text class="pro-text highlight">{{ $t('billing.proFeature2') }}</text>
					</view>
				</view>
			</view>

			<view class="feature-item">
				<view class="feature-label-col">
					<text class="feature-name">Diagnostic Report & Feedback</text>
				</view>
				<view class="feature-values">
					<view class="val-col">
						<text class="free-text">{{ $t('billing.freeFeature3') }}</text>
					</view>
					<view class="val-col">
						<text class="pro-text highlight">{{ $t('billing.proFeature3') }}</text>
					</view>
				</view>
			</view>

			<view class="feature-item no-border">
				<view class="feature-label-col">
					<text class="feature-name">Job Role Rewriting (KZ/UZ ATS)</text>
				</view>
				<view class="feature-values">
					<view class="val-col">
						<text class="free-text">{{ $t('billing.freeFeature4') }}</text>
					</view>
					<view class="val-col">
						<text class="pro-text highlight">{{ $t('billing.proFeature4') }}</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 5. 立即购买按钮 (吸底) -->
		<view class="action-footer">
			<button class="pay-btn" :loading="isProcessing" @tap="openPaymentPopup">
				<text>{{ $t('billing.payNow') }} ({{ currentPriceText }})</text>
			</button>
		</view>

		<!-- 6. 国际卡模拟支付弹窗 -->
		<view v-if="showPaymentModal" class="payment-backdrop" @tap.self="closePaymentPopup">
			<view class="payment-modal">
				<view class="modal-header">
					<text class="modal-title">{{ $t('billing.cardInputTitle') }}</text>
					<view class="close-btn" @tap="closePaymentPopup">×</view>
				</view>
				
				<!-- Stripe Card Simulation Form -->
				<view class="card-form">
					<!-- Supported card icons -->
					<view class="card-brands">
						<text class="brand active">Visa</text>
						<text class="brand active">Mastercard</text>
						<text class="brand active">American Express</text>
					</view>

					<view class="form-group">
						<label class="form-label">{{ $t('billing.cardNumber') }}</label>
						<input 
							type="number" 
							v-model="cardNumber" 
							:placeholder="$t('billing.cardNumberPlaceholder')" 
							class="modal-input" 
							maxlength="16"
						/>
					</view>

					<view class="form-row">
						<view class="form-group half">
							<label class="form-label">{{ $t('billing.cardExpiry') }}</label>
							<input 
								type="text" 
								v-model="cardExpiry" 
								:placeholder="$t('billing.cardExpiryPlaceholder')" 
								class="modal-input" 
								maxlength="5"
							/>
						</view>
						<view class="form-group half">
							<label class="form-label">{{ $t('billing.cardCvv') }}</label>
							<input 
								type="number" 
								v-model="cardCvv" 
								:placeholder="$t('billing.cardCvvPlaceholder')" 
								class="modal-input" 
								maxlength="3"
							/>
						</view>
					</view>

					<button class="modal-submit-btn" :loading="isProcessing" @tap="submitPayment">
						<text>{{ $t('billing.confirmPayment') }}</text>
					</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex';

	export default {
		data() {
			return {
				activeTab: 'pro', // 'pro' or 'sprint'
				selectedOption: 'pro_annual', // 'pro_monthly', 'pro_annual', 'sprint_7d', 'sprint_14d'
				showPaymentModal: false,
				cardNumber: '',
				cardExpiry: '',
				cardCvv: '',
				isProcessing: false
			};
		},
		computed: {
			...mapState(['isLoggedIn', 'userInfo']),
			currentPriceText() {
				const pricing = {
					'pro_monthly': '$6.99',
					'pro_annual': '$49.99',
					'sprint_7d': '$4.99',
					'sprint_14d': '$9.99'
				};
				return pricing[this.selectedOption] || '$0.00';
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
					title: this.$t('billing.subscriptionTitle')
				});
			},
			switchTab(tab) {
				this.activeTab = tab;
				if (tab === 'pro') {
					this.selectedOption = 'pro_annual';
				} else {
					this.selectedOption = 'sprint_7d';
				}
			},
			selectOption(opt) {
				this.selectedOption = opt;
			},
			openPaymentPopup() {
				if (!this.isLoggedIn) {
					uni.showToast({
						title: 'Please log in first',
						icon: 'none'
					});
					setTimeout(() => {
						uni.navigateTo({
							url: '/pages/login/login'
						});
					}, 1000);
					return;
				}
				this.cardNumber = '';
				this.cardExpiry = '';
				this.cardCvv = '';
				this.showPaymentModal = true;
			},
			closePaymentPopup() {
				this.showPaymentModal = false;
			},
			submitPayment() {
				if (this.cardNumber.length < 12) {
					uni.showToast({ title: 'Invalid Card Number', icon: 'none' });
					return;
				}
				if (!this.cardExpiry.includes('/')) {
					uni.showToast({ title: 'Invalid Expiry Date (MM/YY)', icon: 'none' });
					return;
				}
				if (this.cardCvv.length < 3) {
					uni.showToast({ title: 'Invalid CVV', icon: 'none' });
					return;
				}

				this.isProcessing = true;
				this.showPaymentModal = false;
				uni.showLoading({
					title: 'Processing payment...'
				});

				// 模拟 1.5 秒支付处理
				setTimeout(() => {
					uni.hideLoading();
					this.isProcessing = false;
					
					// 支付成功履约逻辑
					const updatedUserInfo = { ...this.userInfo };
					if (this.selectedOption.startsWith('pro_')) {
						updatedUserInfo.plan = 'pro';
						// 追加无限权益模拟
						uni.setStorageSync('kazi_cv_credits', 9999);
						uni.setStorageSync('kazi_interview_credits', 9999);
					} else {
						updatedUserInfo.plan = 'sprint';
						// 追加冲刺包额度
						const addCv = this.selectedOption === 'sprint_7d' ? 2 : 5;
						const addInterview = this.selectedOption === 'sprint_7d' ? 2 : 5;
						
						const currentCv = uni.getStorageSync('kazi_cv_credits') || 1;
						const currentInt = uni.getStorageSync('kazi_interview_credits') || 1;
						
						uni.setStorageSync('kazi_cv_credits', Number(currentCv) + addCv);
						uni.setStorageSync('kazi_interview_credits', Number(currentInt) + addInterview);
					}
					
					// 同步至全局 Store 和 Storage
					this.$store.commit('SET_USER_INFO', updatedUserInfo);
					
					uni.showToast({
						title: this.$t('billing.paymentSuccess'),
						icon: 'success',
						duration: 2000
					});
					
					// 2秒后自动退回“我的”页面
					setTimeout(() => {
						uni.navigateBack();
					}, 2000);
				}, 1500);
			}
		}
	}
</script>

<style lang="scss" scoped>
	.subscription-page {
		min-height: 100vh;
		background-color: #f9fafb; /* 浅灰色背景 */
		color: #1f2937;
		padding: 40rpx 30rpx 200rpx 30rpx;
		font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
		box-sizing: border-box;
	}

	/* 1. Tabs */
	.tab-container {
		display: flex;
		background-color: #f3f4f6;
		border: 1px solid #e5e7eb;
		border-radius: 24rpx;
		padding: 8rpx;
		margin-bottom: 30rpx;
		
		.tab-item {
			flex: 1;
			text-align: center;
			padding: 20rpx 0;
			border-radius: 18rpx;
			transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			-webkit-tap-highlight-color: transparent;
			outline: none;
			
			.tab-title {
				font-size: 28rpx;
				font-weight: 700;
				color: #4b5563;
			}
			
			.tab-subtitle {
				font-size: 18rpx;
				color: #9ca3af;
				margin-top: 4rpx;
				text-transform: uppercase;
				letter-spacing: 0.5px;
			}
			
			&.active {
				background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
				box-shadow: 0 4rpx 20rpx rgba(124, 58, 237, 0.2);
				
				.tab-title {
					color: #ffffff;
				}
				.tab-subtitle {
					color: rgba(255, 255, 255, 0.85);
				}
			}
		}
	}

	/* 2. Intro */
	.intro-box {
		padding: 0 10rpx;
		margin-bottom: 40rpx;
		
		.intro-desc {
			font-size: 26rpx;
			color: #4b5563;
			line-height: 1.5;
			text-align: center;
			display: block;
		}
	}

	/* 3. Cards */
	.cards-list {
		display: flex;
		flex-direction: column;
		gap: 30rpx;
		margin-bottom: 60rpx;
	}

	.pricing-card {
		background: #ffffff;
		border: 1px solid #e5e7eb;
		border-radius: 28rpx;
		padding: 40rpx;
		position: relative;
		transition: all 0.2s ease;
		box-sizing: border-box;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.02);
		
		&.selected {
			background: rgba(37, 99, 235, 0.02);
			border-color: #2563eb;
			box-shadow: 0 10rpx 30rpx rgba(37, 99, 235, 0.08);
			
			&::after {
				content: '✓';
				position: absolute;
				top: 30rpx;
				right: 35rpx;
				width: 36rpx;
				height: 36rpx;
				background-color: #2563eb;
				color: #ffffff;
				border-radius: 50%;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 22rpx;
				font-weight: 700;
			}
		}
		
		.card-header {
			margin-bottom: 20rpx;
			
			.package-name {
				font-size: 32rpx;
				font-weight: 800;
				color: #111827;
			}
		}
		
		.price-row {
			display: flex;
			align-items: baseline;
			margin-bottom: 12rpx;
			
			.currency {
				font-size: 36rpx;
				font-weight: 700;
				color: #2563eb;
				margin-right: 6rpx;
			}
			
			.price {
				font-size: 64rpx;
				font-weight: 900;
				color: #111827;
			}
			
			.unit {
				font-size: 24rpx;
				color: #6b7280;
				margin-left: 10rpx;
			}
		}
		
		.card-desc {
			font-size: 24rpx;
			color: #6b7280;
			line-height: 1.4;
		}
		
		&.premium-badge-card {
			background: linear-gradient(145deg, #ffffff 0%, rgba(124, 58, 237, 0.02) 100%);
			border: 1px solid rgba(124, 58, 237, 0.15);
			
			&.selected {
				border-color: #7c3aed;
				box-shadow: 0 10rpx 30rpx rgba(124, 58, 237, 0.12);
				
				&::after {
					background-color: #7c3aed;
				}
			}
		}

		.badge-tag {
			position: absolute;
			top: -20rpx;
			left: 40rpx;
			background: linear-gradient(135deg, #ef4444 0%, #ec4899 100%);
			color: #ffffff;
			font-size: 18rpx;
			font-weight: 700;
			padding: 6rpx 16rpx;
			border-radius: 50rpx;
			text-transform: uppercase;
			letter-spacing: 0.5px;
			box-shadow: 0 4rpx 10rpx rgba(239, 68, 68, 0.15);
			
			&.locked-tag {
				background: #9ca3af;
				box-shadow: none;
			}
		}
		
		&.locked-card {
			opacity: 0.6;
			border-style: dashed;
			background-color: #f3f4f6;
		}
	}

	/* 4. Comparison List */
	.features-comparison {
		background: #ffffff;
		border: 1px solid #e5e7eb;
		border-radius: 28rpx;
		padding: 30rpx;
		margin-bottom: 50rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.02);
		
		.section-title {
			font-size: 28rpx;
			font-weight: 800;
			color: #111827;
			margin-bottom: 30rpx;
			padding-left: 10rpx;
			border-left: 6rpx solid #2563eb;
			line-height: 1;
		}
		
		.feature-item {
			padding: 24rpx 0;
			border-bottom: 1px solid #f3f4f6;
			display: flex;
			flex-direction: column;
			gap: 12rpx;
			
			&.no-border {
				border-bottom: none;
			}
			
			.feature-label-col {
				.feature-name {
					font-size: 26rpx;
					font-weight: 600;
					color: #374151;
				}
			}
			
			.feature-values {
				display: flex;
				justify-content: space-between;
				gap: 20rpx;
				
				.val-col {
					flex: 1;
					background: #f9fafb;
					padding: 12rpx 20rpx;
					border-radius: 12rpx;
					text-align: center;
					
					.free-text {
						font-size: 22rpx;
						color: #9ca3af;
					}
					
					.pro-text {
						font-size: 22rpx;
						color: #4b5563;
						
						&.highlight {
							color: #2563eb;
							font-weight: 700;
						}
					}
				}
			}
		}
	}

	/* 5. Sticky Footer */
	.action-footer {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background: linear-gradient(180deg, rgba(255, 255, 255, 0.8) 0%, #ffffff 50%);
		backdrop-filter: blur(20px);
		padding: 30rpx 40rpx 50rpx 40rpx;
		z-index: 10;
		box-sizing: border-box;
		border-top: 1px solid rgba(0, 0, 0, 0.05);
		
		.pay-btn {
			width: 100%;
			height: 100rpx;
			background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
			border: none;
			border-radius: 24rpx;
			color: #ffffff;
			font-size: 30rpx;
			font-weight: 700;
			display: flex;
			align-items: center;
			justify-content: center;
			box-shadow: 0 8rpx 30rpx rgba(124, 58, 237, 0.2);
			transition: all 0.2s ease;
			box-sizing: border-box;
			
			&:active {
				opacity: 0.95;
				transform: translateY(2rpx);
			}
		}
	}

	/* 6. Card Payment Backdrop & Modal */
	.payment-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.4);
		backdrop-filter: blur(8px);
		display: flex;
		align-items: flex-end;
		justify-content: center;
		z-index: 999;
	}

	.payment-modal {
		background: #ffffff;
		border-top: 1px solid #e5e7eb;
		border-radius: 40rpx 40rpx 0 0;
		width: 100%;
		max-width: 750rpx;
		padding: 40rpx 40rpx 60rpx 40rpx;
		box-sizing: border-box;
		animation: slide-up 0.3s ease-out;
		
		.modal-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 40rpx;
			
			.modal-title {
				font-size: 34rpx;
				font-weight: 800;
				color: #111827;
			}
			
			.close-btn {
				font-size: 48rpx;
				color: #9ca3af;
				padding: 10rpx;
				line-height: 1;
			}
		}
	}

	.card-form {
		.card-brands {
			display: flex;
			gap: 15rpx;
			margin-bottom: 30rpx;
			
			.brand {
				font-size: 20rpx;
				color: #9ca3af;
				background-color: #f3f4f6;
				padding: 6rpx 16rpx;
				border-radius: 8rpx;
				font-weight: 700;
				
				&.active {
					color: #4b5563;
					background-color: #e5e7eb;
					border: 1px solid rgba(0, 0, 0, 0.05);
				}
			}
		}

		.form-group {
			margin-bottom: 30rpx;
			display: flex;
			flex-direction: column;
			
			&.half {
				flex: 1;
			}
			
			.form-label {
				font-size: 22rpx;
				color: #4b5563;
				font-weight: 700;
				text-transform: uppercase;
				letter-spacing: 0.5px;
				margin-bottom: 12rpx;
			}
			
			.modal-input {
				background-color: #f9fafb;
				border: 1px solid #e5e7eb;
				border-radius: 16rpx;
				height: 90rpx;
				line-height: 90rpx;
				padding: 0 24rpx;
				font-size: 28rpx;
				color: #111827;
				box-sizing: border-box;
				
				&:focus {
					border-color: #2563eb;
					background-color: #ffffff;
				}
			}
		}

		.form-row {
			display: flex;
			gap: 30rpx;
			margin-bottom: 40rpx;
		}

		.modal-submit-btn {
			width: 100%;
			height: 96rpx;
			background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
			border: none;
			border-radius: 20rpx;
			color: #ffffff;
			font-size: 28rpx;
			font-weight: 700;
			display: flex;
			align-items: center;
			justify-content: center;
			box-shadow: 0 4rpx 15rpx rgba(37, 99, 235, 0.25);
			box-sizing: border-box;
		}
	}

	@keyframes slide-up {
		from {
			transform: translateY(100%);
		}
		to {
			transform: translateY(0);
		}
	}
</style>
