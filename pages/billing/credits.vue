<template>
	<view class="credits-page">
		<!-- 1. 余额面板 (Graphic Balance Dash) -->
		<view class="balance-dash">
			<view class="balance-box">
				<view class="icon-circle cv-icon">
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2ZM16 18H8V16H16V18ZM16 14H8V12H16V14ZM13 9V3.5L18.5 9H13Z" fill="#3B82F6"/>
					</svg>
				</view>
				<view class="balance-info">
					<text class="balance-label">{{ $t('mine.cvCreditsLabel') }}</text>
					<view class="value-row">
						<text class="balance-val">{{ cvCredits }}</text>
						<text class="max-val">/ {{ maxCvCredits }}</text>
					</view>
				</view>
			</view>

			<view class="balance-box">
				<view class="icon-circle interview-icon">
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M21 6H3C1.9 6 1 6.9 1 8V16C1 17.1 1.9 18 3 18H21C22.1 18 23 17.1 23 16V8C23 6.9 22.1 6 21 6ZM21 16H3V8H21V16ZM12 9C9.79 9 8 10.79 8 13C8 15.21 9.79 17 12 17C14.21 17 16 15.21 16 13C16 10.79 14.21 9 12 9Z" fill="#8B5CF6"/>
					</svg>
				</view>
				<view class="balance-info">
					<text class="balance-label">{{ $t('mine.mockInterviewsLabel') }}</text>
					<view class="value-row">
						<text class="balance-val">{{ interviewCredits }}</text>
						<text class="max-val">left</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 2. 简历 vs 面试 Tab 切换 -->
		<view class="tab-container">
			<view 
				class="tab-item" 
				:class="{ active: activeTab === 'cv' }" 
				@tap="switchTab('cv')"
			>
				<text class="tab-text">{{ $t('billing.cvCreditsTab') }}</text>
			</view>
			<view 
				class="tab-item" 
				:class="{ active: activeTab === 'interview' }" 
				@tap="switchTab('interview')"
			>
				<text class="tab-text">{{ $t('billing.interviewCreditsTab') }}</text>
			</view>
		</view>

		<!-- 3. 板块规则介绍 -->
		<view class="intro-box">
			<text class="intro-text">
				{{ activeTab === 'cv' ? $t('billing.cvTabDesc') : $t('billing.interviewTabDesc') }}
			</text>
		</view>

		<!-- 4. 套餐加油包卡片列表 -->
		<view class="packages-grid">
			<view 
				v-for="pack in activePackages" 
				:key="pack.id"
				class="package-card"
				:class="{ selected: selectedPackId === pack.id }"
				@tap="selectPackage(pack)"
			>
				<view class="pack-badge" v-if="pack.badge">{{ pack.badge }}</view>
				<text class="pack-title">{{ pack.title }}</text>
				<text class="pack-amount">+{{ pack.credits }} Credits</text>
				<view class="price-row">
					<text class="dollar">$</text>
					<text class="price">{{ pack.price }}</text>
				</view>
				<text class="pack-desc">{{ pack.desc }}</text>
			</view>
		</view>

		<!-- 5. 立即购买悬浮底栏 -->
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
				
				<view class="card-form">
					<view class="card-brands">
						<text class="brand active">Visa</text>
						<text class="brand active">Mastercard</text>
						<text class="brand active">AMEX</text>
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
				cvCredits: 1,
				maxCvCredits: 2,
				interviewCredits: 1,
				activeTab: 'cv', // 'cv' or 'interview'
				selectedPackId: 'cv_pack_2',
				showPaymentModal: false,
				cardNumber: '',
				cardExpiry: '',
				cardCvv: '',
				isProcessing: false
			};
		},
		computed: {
			...mapState(['isLoggedIn', 'userInfo']),
			cvPackages() {
				return [
					{ id: 'cv_pack_1', title: this.$t('billing.cvPack1Name'), credits: 1, price: '1.99', desc: this.$t('billing.cvPack1Desc'), badge: '' },
					{ id: 'cv_pack_2', title: this.$t('billing.cvPack2Name'), credits: 5, price: '6.99', desc: this.$t('billing.cvPack2Desc'), badge: 'Best Value' },
					{ id: 'cv_pack_3', title: this.$t('billing.cvPack3Name'), credits: 10, price: '9.99', desc: this.$t('billing.cvPack3Desc'), badge: 'Popular' }
				];
			},
			interviewPackages() {
				return [
					{ id: 'int_pack_1', title: this.$t('billing.interviewPack1Name'), credits: 1, price: '2.99', desc: this.$t('billing.interviewPack1Desc'), badge: '' },
					{ id: 'int_pack_2', title: this.$t('billing.interviewPack2Name'), credits: 3, price: '6.99', desc: this.$t('billing.interviewPack2Desc'), badge: 'Save 20%' },
					{ id: 'int_pack_3', title: this.$t('billing.interviewPack3Name'), credits: 5, price: '9.99', desc: this.$t('billing.interviewPack3Desc'), badge: 'Hot Pick' }
				];
			},
			activePackages() {
				return this.activeTab === 'cv' ? this.cvPackages : this.interviewPackages;
			},
			currentSelectedPack() {
				return this.activePackages.find(p => p.id === this.selectedPackId);
			},
			currentPriceText() {
				return this.currentSelectedPack ? `$${this.currentSelectedPack.price}` : '$0.00';
			}
		},
		watch: {
			'$i18n.locale'() {
				this.updateTitle();
			}
		},
		mounted() {
			this.updateTitle();
			this.loadBalances();
		},
		methods: {
			updateTitle() {
				uni.setNavigationBarTitle({
					title: this.$t('billing.creditsTitle')
				});
			},
			loadBalances() {
				const cv = uni.getStorageSync('kazi_cv_credits');
				const maxCv = uni.getStorageSync('kazi_max_cv_credits');
				const interview = uni.getStorageSync('kazi_interview_credits');
				
				if (cv !== '') this.cvCredits = Number(cv);
				if (maxCv !== '') this.maxCvCredits = Number(maxCv);
				if (interview !== '') this.interviewCredits = Number(interview);
			},
			switchTab(tab) {
				this.activeTab = tab;
				this.selectedPackId = tab === 'cv' ? 'cv_pack_2' : 'int_pack_2';
			},
			selectPackage(pack) {
				this.selectedPackId = pack.id;
			},
			openPaymentPopup() {
				if (!this.isLoggedIn) {
					uni.showToast({ title: 'Please log in first', icon: 'none' });
					setTimeout(() => {
						uni.navigateTo({ url: '/pages/login/login' });
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
				uni.showLoading({ title: 'Processing payment...' });

				setTimeout(() => {
					uni.hideLoading();
					this.isProcessing = false;

					// 累加额度与存储
					const pack = this.currentSelectedPack;
					if (this.activeTab === 'cv') {
						const nextCv = Number(this.cvCredits) + pack.credits;
						const nextMax = Number(this.maxCvCredits) + pack.credits;
						uni.setStorageSync('kazi_cv_credits', nextCv);
						uni.setStorageSync('kazi_max_cv_credits', nextMax);
					} else {
						const nextInt = Number(this.interviewCredits) + pack.credits;
						uni.setStorageSync('kazi_interview_credits', nextInt);
					}

					// 写入 Ledger 日志备存
					const ledger = uni.getStorageSync('kazi_credits_ledger') || [];
					ledger.unshift({
						id: Date.now(),
						type: this.activeTab === 'cv' ? 'cv_credits' : 'interview_credits',
						amount: pack.credits,
						price: pack.price,
						date: new Date().toISOString().split('T')[0]
					});
					uni.setStorageSync('kazi_credits_ledger', ledger);

					uni.showToast({
						title: this.$t('billing.paymentSuccess'),
						icon: 'success',
						duration: 2000
					});

					// 重新拉取余额并关闭
					this.loadBalances();
					setTimeout(() => {
						uni.navigateBack();
					}, 2000);
				}, 1500);
			}
		}
	}
</script>

<style lang="scss" scoped>
	.credits-page {
		min-height: 100vh;
		background-color: #f9fafb; /* 浅灰色背景 */
		color: #1f2937;
		padding: 40rpx 30rpx 200rpx 30rpx;
		font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
		box-sizing: border-box;
	}

	/* 1. Dashboard */
	.balance-dash {
		display: flex;
		gap: 30rpx;
		margin-bottom: 40rpx;
		
		.balance-box {
			flex: 1;
			background: #ffffff;
			border: 1px solid #e5e7eb;
			border-radius: 28rpx;
			padding: 30rpx 24rpx;
			display: flex;
			align-items: center;
			gap: 20rpx;
			box-sizing: border-box;
			box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.02);
			
			.icon-circle {
				width: 70rpx;
				height: 70rpx;
				border-radius: 50%;
				display: flex;
				align-items: center;
				justify-content: center;
				
				&.cv-icon {
					background-color: rgba(59, 130, 246, 0.08);
					color: #3b82f6;
				}
				&.interview-icon {
					background-color: rgba(139, 92, 246, 0.08);
					color: #8b5cf6;
				}
			}
			
			.balance-info {
				display: flex;
				flex-direction: column;
				
				.balance-label {
					font-size: 20rpx;
					color: #6b7280;
					text-transform: uppercase;
					letter-spacing: 0.5px;
					margin-bottom: 4rpx;
				}
				
				.value-row {
					display: flex;
					align-items: baseline;
					
					.balance-val {
						font-size: 38rpx;
						font-weight: 900;
						color: #111827;
					}
					
					.max-val {
						font-size: 22rpx;
						color: #9ca3af;
						margin-left: 6rpx;
					}
				}
			}
		}
	}

	/* 2. Tabs */
	.tab-container {
		display: flex;
		background-color: #f3f4f6;
		border: 1px solid #e5e7eb;
		border-radius: 20rpx;
		padding: 6rpx;
		margin-bottom: 30rpx;
		
		.tab-item {
			flex: 1;
			text-align: center;
			padding: 18rpx 0;
			border-radius: 16rpx;
			transition: all 0.25s ease;
			border: 1px solid transparent;
			-webkit-tap-highlight-color: transparent;
			outline: none;
			
			.tab-text {
				font-size: 26rpx;
				font-weight: 700;
				color: #4b5563;
			}
			
			&.active {
				background-color: #ffffff;
				border-color: rgba(0, 0, 0, 0.05);
				box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.03);
				
				.tab-text {
					color: #3b82f6;
				}
			}
		}
	}

	/* 3. Rule Box */
	.intro-box {
		margin-bottom: 40rpx;
		padding: 0 10rpx;
		
		.intro-text {
			font-size: 24rpx;
			color: #6b7280;
			line-height: 1.5;
			display: block;
		}
	}

	/* 4. Packages Grid */
	.packages-grid {
		display: flex;
		flex-direction: column;
		gap: 30rpx;
		margin-bottom: 60rpx;
	}

	.package-card {
		background: #ffffff;
		border: 1px solid #e5e7eb;
		border-radius: 28rpx;
		padding: 35rpx 40rpx;
		position: relative;
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		transition: all 0.2s ease;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.02);
		
		&.selected {
			background: rgba(59, 130, 246, 0.02);
			border-color: #3b82f6;
			box-shadow: 0 10rpx 25rpx rgba(59, 130, 246, 0.06);
			
			&::after {
				content: '✓';
				position: absolute;
				top: 30rpx;
				right: 35rpx;
				width: 32rpx;
				height: 32rpx;
				background-color: #3b82f6;
				color: #ffffff;
				border-radius: 50%;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 20rpx;
				font-weight: 700;
			}
		}
		
		.pack-badge {
			position: absolute;
			top: -16rpx;
			left: 40rpx;
			background: linear-gradient(135deg, #10b981 0%, #059669 100%);
			color: #ffffff;
			font-size: 16rpx;
			font-weight: 700;
			padding: 4rpx 14rpx;
			border-radius: 50rpx;
			text-transform: uppercase;
			box-shadow: 0 4rpx 10rpx rgba(16, 185, 129, 0.15);
		}
		
		.pack-title {
			font-size: 26rpx;
			color: #4b5563;
			font-weight: 600;
			margin-bottom: 8rpx;
		}
		
		.pack-amount {
			font-size: 34rpx;
			font-weight: 800;
			color: #111827;
			margin-bottom: 15rpx;
		}
		
		.price-row {
			display: flex;
			align-items: baseline;
			margin-bottom: 8rpx;
			
			.dollar {
				font-size: 26rpx;
				font-weight: 700;
				color: #3b82f6;
				margin-right: 4rpx;
			}
			
			.price {
				font-size: 48rpx;
				font-weight: 900;
				color: #111827;
			}
		}
		
		.pack-desc {
			font-size: 22rpx;
			color: #6b7280;
		}
	}

	/* 5. Action Sticky Footer */
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
			background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
			border: none;
			border-radius: 24rpx;
			color: #ffffff;
			font-size: 30rpx;
			font-weight: 700;
			display: flex;
			align-items: center;
			justify-content: center;
			box-shadow: 0 8rpx 30rpx rgba(37, 99, 235, 0.2);
			transition: all 0.2s ease;
			box-sizing: border-box;
			
			&:active {
				opacity: 0.95;
				transform: translateY(2rpx);
			}
		}
	}

	/* 6. Card Payment Modal */
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
					border-color: #3b82f6;
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
			background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
			border: none;
			border-radius: 20rpx;
			color: #ffffff;
			font-size: 28rpx;
			font-weight: 700;
			display: flex;
			align-items: center;
			justify-content: center;
			box-shadow: 0 4rpx 15rpx rgba(37, 99, 235, 0.2);
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
