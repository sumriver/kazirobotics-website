<template>
	<view class="login-page" :style="{ minHeight: $windowHeight ? $windowHeight + 'px' : '100vh' }">
		
		<view class="login-container">
			<!-- Header / Logo -->
			<view class="login-header">
				<image src="/static/kazi_avatar.png" mode="aspectFill" class="logo-img"></image>
				<text class="title">KaziSpace</text>
				<text class="subtitle">AI-Powered Career & Interview Companion</text>
			</view>
			
			<!-- Form Card -->
			<view class="form-card">
				<text class="form-title">Verification Login</text>
				
				<!-- Phone Number Input Group -->
				<view class="input-group">
					<view class="prefix-selector">
						<picker :range="prefixes" :value="prefixIndex" @change="onPrefixChange">
							<view class="picker-value">
								<text>{{ phonePrefix }}</text>
								<text class="arrow">▼</text>
							</view>
						</picker>
					</view>
					<input 
						type="number" 
						v-model="phoneNumber" 
						placeholder="Enter phone number" 
						class="phone-input" 
						placeholder-style="color: #9CA3AF"
					/>
				</view>
				
				<!-- OTP Code Input Group -->
				<view class="input-group otp-group">
					<input 
						type="number" 
						v-model="otpCode" 
						placeholder="Verification code" 
						class="otp-input"
						placeholder-style="color: #9CA3AF"
					/>
					<u-button 
						class="send-btn" 
						size="small"
						type="text"
						:disabled="countdown > 0 || loading" 
						@click="sendCode"
					>
						{{ countdown > 0 ? `${countdown}s` : 'Send Code' }}
					</u-button>
				</view>
				
				<!-- Submit Login -->
				<button class="login-btn" :loading="loading" @tap="handleLogin">
					<text>Log In / Register</text>
				</button>
				
				<view class="info-note">
					New phone numbers will register an account automatically.
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { requestOtp } from '@/common/api.js';

	export default {
		data() {
			return {
				phonePrefix: '+7',
				prefixes: ['+7', '+86', '+998'],
				prefixIndex: 0,
				phoneNumber: '',
				otpCode: '',
				countdown: 0,
				timer: null,
				loading: false,
				otpRequestId: null
			};
		},
		methods: {
			onPrefixChange(e) {
				this.prefixIndex = e.detail.value;
				this.phonePrefix = this.prefixes[this.prefixIndex];
			},
			async sendCode() {
				if (!this.phoneNumber.trim()) {
					uni.showToast({ title: 'Please enter phone number', icon: 'none' });
					return;
				}
				
				const fullPhone = this.phonePrefix + this.phoneNumber.trim();
				this.loading = true;
				try {
					const res = await requestOtp({ phone: fullPhone });
					if (res && res.status === 'sent') {
						this.otpRequestId = res.otp_request_id;
						uni.showToast({ title: 'OTP sent successfully', icon: 'none' });
						
						// If mock provider responds with _mock_code, display it for development purposes
						if (res._mock_code) {
							uni.showModal({
								title: 'Development OTP Code',
								content: `Your mock OTP code is: ${res._mock_code}`,
								showCancel: false,
								confirmText: 'OK'
							});
						}
						
						// Start countdown
						this.countdown = 60;
						this.timer = setInterval(() => {
							if (this.countdown > 1) {
								this.countdown--;
							} else {
								clearInterval(this.timer);
								this.countdown = 0;
							}
						}, 1000);
					}
				} catch (e) {
					console.error('Request OTP failed:', e);
					uni.showToast({
						title: e.data?.message || 'Failed to send OTP code',
						icon: 'none'
					});
				} finally {
					this.loading = false;
				}
			},
			async handleLogin() {
				if (!this.phoneNumber.trim()) {
					uni.showToast({ title: 'Please enter phone number', icon: 'none' });
					return;
				}
				if (!this.otpCode.trim()) {
					uni.showToast({ title: 'Please enter verification code', icon: 'none' });
					return;
				}
				
				const fullPhone = this.phonePrefix + this.phoneNumber.trim();
				const deviceId = uni.getStorageSync('device_id') || '';
				
				this.loading = true;
				try {
					await this.$store.dispatch('login', {
						phone: fullPhone,
						otp_code: this.otpCode.trim(),
						device_id: deviceId,
						otp_request_id: this.otpRequestId
					});
					
					uni.showToast({ title: 'Login successful', icon: 'success' });
					setTimeout(() => {
						uni.navigateBack();
					}, 1000);
				} catch (e) {
					console.error('Verify OTP failed:', e);
					uni.showToast({
						title: e.data?.message || 'Incorrect verification code',
						icon: 'none'
					});
				} finally {
					this.loading = false;
				}
			},
			updateTitle() {
				uni.setNavigationBarTitle({
					title: this.$t('login.title')
				});
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
		beforeDestroy() {
			if (this.timer) {
				clearInterval(this.timer);
			}
		}
	}
</script>

<style lang="scss">
	.login-page {
		/* min-height: 100vh; */ /* Removed 100vh to use dynamic windowHeight instead, avoiding display/scroll issues on H5/Mobile browsers */
		background: #ffffff;
		position: relative;
		overflow: hidden;
		display: flex;
		justify-content: center;
		align-items: flex-start;
		font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
		box-sizing: border-box;
	}

	.login-container {
		width: 100%;
		max-width: 650rpx;
		padding: 80rpx 40rpx 40rpx 40rpx;
		z-index: 2;
		display: flex;
		flex-direction: column;
		align-items: center;
		box-sizing: border-box;
	}

	.login-header {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 50rpx;
		text-align: center;
		
		.logo-img {
			width: 130rpx;
			height: 130rpx;
			border-radius: 36rpx;
			margin-bottom: 20rpx;
		}
		
		.title {
			font-size: 46rpx;
			font-weight: 800;
			color: #1e3a8a;
			letter-spacing: 1px;
		}
		
		.subtitle {
			font-size: 24rpx;
			color: #4b5563;
			margin-top: 10rpx;
		}
	}

	.form-card {
		width: 100%;
		background: transparent;
		border-radius: 32rpx;
		padding: 30rpx 20rpx;
		box-sizing: border-box;
		
		.form-title {
			font-size: 34rpx;
			font-weight: 700;
			color: #1e293b;
			margin-bottom: 40rpx;
			display: block;
			text-align: center;
		}
	}

	.input-group {
		height: 104rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		background-color: #ffffff;
		border: 1px solid #e2e8f0;
		border-radius: 20rpx;
		padding: 0 30rpx;
		margin-bottom: 30rpx;
		transition: all 0.3s ease;
		
		&:focus-within {
			border-color: #3b82f6;
			box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
		}
		
		.prefix-selector {
			margin-right: 20rpx;
			padding-right: 20rpx;
			border-right: 1px solid #e2e8f0;
			
			.picker-value {
				display: flex;
				align-items: center;
				font-size: 28rpx;
				font-weight: 600;
				color: #1e293b;
				
				.arrow {
					font-size: 16rpx;
					color: #94a3b8;
					margin-left: 8rpx;
				}
			}
		}
		
		.phone-input {
			flex: 1;
			font-size: 28rpx;
			color: #1e293b;
			font-weight: 500;
		}
		
		&.otp-group {
			padding: 0 12rpx 0 30rpx;
			
			.otp-input {
				flex: 1;
				font-size: 28rpx;
				color: #1e293b;
				font-weight: 500;
			}
			
			.send-btn {
				width: auto;
				margin: 0;
				padding: 0 10rpx;
				background: transparent !important;
				border: none !important;
				box-shadow: none !important;
				
				::v-deep .u-button__text {
					color: #2563eb !important;
					font-size: 26rpx !important;
					font-weight: 600 !important;
				}
				
				&.u-button--disabled {
					opacity: 0.6;
					::v-deep .u-button__text {
						color: #94a3b8 !important;
					}
				}
			}
		}
	}

	.login-btn {
		width: 100%;
		height: 104rpx;
		box-sizing: border-box;
		background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
		color: #ffffff;
		font-size: 30rpx;
		font-weight: 700;
		border-radius: 20rpx;
		margin-top: 20rpx;
		border: none;
		box-shadow: 0 10rpx 20rpx rgba(37, 99, 235, 0.2);
		display: flex;
		justify-content: center;
		align-items: center;
		
		&:active {
			opacity: 0.95;
		}
	}

	.info-note {
		font-size: 22rpx;
		color: #64748b;
		text-align: center;
		margin-top: 30rpx;
		line-height: 1.4;
	}
</style>