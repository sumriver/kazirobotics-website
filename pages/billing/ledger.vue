<template>
	<view class="ledger-page">
		<!-- 1. 余额总览面板 (Balance Overview Dash) -->
		<view class="balance-dash">
			<view class="balance-box">
				<view class="icon-circle cv-icon">
					<svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2ZM16 18H8V16H16V18ZM16 14H8V12H16V14ZM13 9V3.5L18.5 9H13Z" fill="#3B82F6"/>
					</svg>
				</view>
				<view class="balance-info">
					<text class="balance-label">{{ $t('ledger.cvCredits') }}</text>
					<view class="value-row">
						<text class="balance-val">{{ cvCredits }}</text>
						<text class="max-val">/ {{ maxCvCredits }}</text>
					</view>
				</view>
			</view>

			<view class="balance-box">
				<view class="icon-circle interview-icon">
					<svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M21 6H3C1.9 6 1 6.9 1 8V16C1 17.1 1.9 18 3 18H21C22.1 18 23 17.1 23 16V8C23 6.9 22.1 6 21 6ZM21 16H3V8H21V16ZM12 9C9.79 9 8 10.79 8 13C8 15.21 9.79 17 12 17C14.21 17 16 15.21 16 13C16 10.79 14.21 9 12 9Z" fill="#8B5CF6"/>
					</svg>
				</view>
				<view class="balance-info">
					<text class="balance-label">{{ $t('ledger.interviewCredits') }}</text>
					<view class="value-row">
						<text class="balance-val">{{ interviewCredits }}</text>
						<text class="max-val">left</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 2. 分类过滤 Tab (Filter Tabs) -->
		<view class="tab-container">
			<view 
				class="tab-item" 
				:class="{ active: activeTab === 'all' }" 
				@tap="switchTab('all')"
			>
				<text class="tab-text">{{ $t('ledger.allFilter') }}</text>
			</view>
			<view 
				class="tab-item" 
				:class="{ active: activeTab === 'consume' }" 
				@tap="switchTab('consume')"
			>
				<text class="tab-text">{{ $t('ledger.consumptionFilter') }}</text>
			</view>
			<view 
				class="tab-item" 
				:class="{ active: activeTab === 'recharge' }" 
				@tap="switchTab('recharge')"
			>
				<text class="tab-text">{{ $t('ledger.rechargeFilter') }}</text>
			</view>
		</view>

		<!-- 3. 时间轴流水列表 (Timeline Ledger List) -->
		<view class="ledger-list" v-if="filteredItems.length > 0">
			<view 
				v-for="item in filteredItems" 
				:key="item.id" 
				class="ledger-card"
			>
				<!-- 左侧图标圈 -->
				<view class="card-left">
					<view class="icon-circle" :class="getIconClass(item)">
						<!-- 简历优化图标 -->
						<svg v-if="item.type === 'cv_consume'" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2ZM16 18H8V16H16V18ZM16 14H8V12H16V14ZM13 9V3.5L18.5 9H13Z" fill="currentColor"/>
						</svg>
						<!-- 模拟面试图标 -->
						<svg v-else-if="item.type === 'interview_consume'" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M12 14C14.21 14 16 12.21 16 10V5C16 2.79 14.21 1 12 1C9.79 1 8 2.79 8 5V10C8 12.21 9.79 14 12 14ZM19 10H17C17 12.76 14.76 15 12 15C9.24 15 7 12.76 7 10H5C5 13.41 7.72 16.23 11 16.93V20H13V16.93C16.28 16.23 19 13.41 19 10Z" fill="currentColor"/>
						</svg>
						<!-- 购买充值图标 -->
						<svg v-else-if="item.type === 'cv_recharge' || item.type === 'interview_recharge'" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M21 18V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V5C3 3.9 3.9 3 5 3H19C20.1 3 21 3.9 21 5V6H12C10.9 6 10 6.9 10 8V16C10 17.1 10.9 18 12 18H21ZM12 16H22V8H12V16Z" fill="currentColor"/>
						</svg>
						<!-- 欢迎礼包 & 订阅奖励图标 -->
						<svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor"/>
							<path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
							<path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
						</svg>
					</view>
				</view>

				<!-- 中间说明与日期 -->
				<view class="card-mid">
					<text class="title">{{ getTitleText(item) }}</text>
					<text class="date">{{ item.date }}</text>
					<view class="detail-pill" :class="{ free: !item.price }">
						<text class="detail-text">{{ item.price ? $t('ledger.detailPrice', { price: item.price }) : $t('ledger.detailFree') }}</text>
					</view>
				</view>

				<!-- 右侧额度变动与结余快照 -->
				<view class="card-right">
					<text class="change-amount" :class="{ plus: item.isRecharge }">
						{{ item.isRecharge ? '+' : '-' }}{{ item.amount }}
					</text>
					<text class="remaining-snapshot">
						{{ $t('ledger.remaining', { count: getRemainingText(item) }) }}
					</text>
				</view>
			</view>
		</view>

		<!-- 4. 空数据状态 (Empty State) -->
		<view class="empty-box" v-else>
			<view class="empty-illustration">
				<svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19ZM17 12H7V10H17V12Z" fill="#D1D5DB"/>
				</svg>
			</view>
			<text class="empty-text">{{ $t('ledger.emptyState') }}</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				cvCredits: 1,
				maxCvCredits: 2,
				interviewCredits: 1,
				activeTab: 'all', // 'all', 'consume', 'recharge'
				mockItems: [
					{
						id: 1,
						type: 'cv_consume',
						amount: 1,
						unit: 'CV',
						date: '2026-06-25 14:20',
						isRecharge: false,
						price: null,
						remainingCv: 1,
						remainingInt: 1
					},
					{
						id: 2,
						type: 'pro_recharge',
						amount: 2,
						unit: 'CV',
						date: '2026-06-24 09:00',
						isRecharge: true,
						price: null,
						remainingCv: 2,
						remainingInt: 1
					},
					{
						id: 3,
						type: 'interview_consume',
						amount: 1,
						unit: 'Interview',
						date: '2026-06-23 18:30',
						isRecharge: false,
						price: null,
						remainingCv: 0,
						remainingInt: 0
					},
					{
						id: 4,
						type: 'interview_recharge',
						amount: 3,
						unit: 'Interview',
						date: '2026-06-23 18:15',
						isRecharge: true,
						price: '$6.99',
						remainingCv: 0,
						remainingInt: 1
					},
					{
						id: 5,
						type: 'welcome_gift',
						amount: 1,
						unit: 'Both',
						date: '2026-06-22 10:00',
						isRecharge: true,
						price: null,
						remainingCv: 1,
						remainingInt: 1
					}
				]
			};
		},
		computed: {
			filteredItems() {
				if (this.activeTab === 'consume') {
					return this.mockItems.filter(item => !item.isRecharge);
				}
				if (this.activeTab === 'recharge') {
					return this.mockItems.filter(item => item.isRecharge);
				}
				return this.mockItems;
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
					title: this.$t('ledger.title')
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
			},
			getIconClass(item) {
				if (item.type === 'cv_consume') return 'cv-bg';
				if (item.type === 'interview_consume') return 'interview-bg';
				if (item.type === 'welcome_gift') return 'gift-bg';
				return 'recharge-bg';
			},
			getTitleText(item) {
				const map = {
					cv_consume: this.$t('ledger.typeCvConsume'),
					interview_consume: this.$t('ledger.typeInterviewConsume'),
					cv_recharge: this.$t('ledger.typeCvRecharge'),
					interview_recharge: this.$t('ledger.typeInterviewRecharge'),
					welcome_gift: this.$t('ledger.typeWelcomeGift'),
					pro_recharge: this.$t('ledger.typeProRecharge')
				};
				return map[item.type] || item.type;
			},
			getRemainingText(item) {
				if (item.type === 'welcome_gift') {
					return `${item.remainingCv} CV / ${item.remainingInt} Mock`;
				}
				return item.unit === 'CV' ? `${item.remainingCv} CV` : `${item.remainingInt} Mock`;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.ledger-page {
		min-height: 100vh;
		background-color: #f9fafb;
		padding: 40rpx 30rpx 60rpx 30rpx;
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
		margin-bottom: 40rpx;
		
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

	/* 3. Ledger Timeline List */
	.ledger-list {
		display: flex;
		flex-direction: column;
		gap: 24rpx;
	}

	.ledger-card {
		background: #ffffff;
		border: 1px solid #e5e7eb;
		border-radius: 28rpx;
		padding: 30rpx;
		display: flex;
		align-items: center;
		box-sizing: border-box;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.02);
		
		.card-left {
			margin-right: 24rpx;
			display: flex;
			align-items: center;
			
			.icon-circle {
				width: 76rpx;
				height: 76rpx;
				border-radius: 50%;
				display: flex;
				align-items: center;
				justify-content: center;
				
				&.cv-bg {
					background-color: rgba(59, 130, 246, 0.08);
					color: #3b82f6;
				}
				&.interview-bg {
					background-color: rgba(139, 92, 246, 0.08);
					color: #8b5cf6;
				}
				&.recharge-bg {
					background-color: rgba(16, 185, 129, 0.08);
					color: #10b981;
				}
				&.gift-bg {
					background-color: rgba(245, 158, 11, 0.08);
					color: #f59e0b;
				}
			}
		}
		
		.card-mid {
			flex: 1;
			display: flex;
			flex-direction: column;
			gap: 8rpx;
			
			.title {
				font-size: 28rpx;
				font-weight: 700;
				color: #111827;
			}
			
			.date {
				font-size: 22rpx;
				color: #9ca3af;
			}
			
			.detail-pill {
				align-self: flex-start;
				background-color: rgba(16, 185, 129, 0.08);
				border-radius: 8rpx;
				padding: 4rpx 12rpx;
				
				&.free {
					background-color: rgba(107, 114, 128, 0.08);
				}
				
				.detail-text {
					font-size: 18rpx;
					font-weight: 600;
					color: #10b981;
				}
				
				&.free .detail-text {
					color: #6b7280;
				}
			}
		}
		
		.card-right {
			display: flex;
			flex-direction: column;
			align-items: flex-end;
			gap: 10rpx;
			
			.change-amount {
				font-size: 32rpx;
				font-weight: 800;
				color: #374151;
				
				&.plus {
					color: #10b981;
				}
			}
			
			.remaining-snapshot {
				font-size: 22rpx;
				color: #9ca3af;
				font-weight: 500;
			}
		}
	}

	/* 4. Empty State */
	.empty-box {
		padding: 100rpx 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 20rpx;
		
		.empty-illustration {
			opacity: 0.6;
		}
		
		.empty-text {
			font-size: 26rpx;
			color: #9ca3af;
			font-weight: 500;
		}
	}
</style>
