<template>
	<view class="container">
		<view>
			<!-- Custom Top Navigation Bar -->
			<view class="header-bar">
				<view class="header-left" @tap="toggleDrawer">
					<!-- Hamburger Menu SVG -->
					<svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M1 1H19M1 8H19M1 15H19" stroke="#111827" stroke-width="2" stroke-linecap="round"/>
					</svg>
				</view>
				<view class="header-center">Kazi</view>
				<view class="header-right"></view>
			</view>
			<!-- Left Drawer Popup (using uView u-popup component) -->
			<u-popup :show="showDrawer" mode="left" @close="showDrawer = false">
				<view class="drawer-content">
					<!-- Drawer Header -->
					<view class="drawer-header">
						<text class="drawer-title">Kazi</text>
						<!-- Search Icon -->
						<view class="search-icon-btn">
							<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M12.5 12.5L16 16M14.5 8C14.5 11.5899 11.5899 14.5 8 14.5C4.41015 14.5 1.5 11.5899 1.5 8C1.5 4.41015 4.41015 1.5 8 1.5C11.5899 1.5 14.5 4.41015 14.5 8Z" stroke="#4B5563" stroke-width="2" stroke-linecap="round"/>
							</svg>
						</view>
					</view>
			
					<!-- New Chat Button -->
					<view class="new-chat-btn" @tap="resetChat">
						<!-- New Chat Icon -->
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right: 12rpx;">
							<path d="M12 5V19M5 12H19" stroke="#374151" stroke-width="2.5" stroke-linecap="round"/>
						</svg>
						<text>New Consultation</text>
					</view>
			
					<!-- Shortcuts -->
					<view class="drawer-menu-list">
						<view class="drawer-menu-item" @tap="navigateTo('/pages/index/index')">
							<text class="menu-item-icon">📊</text>
							<text class="menu-item-text">Career Dashboard</text>
							<!-- Right Arrow -->
							<svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M9 5L16 12L9 19" stroke="#9CA3AF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
							</svg>
						</view>
						<view class="drawer-menu-item" @tap="sendQuickMessage('Help me diagnose my resume and optimize it in English using STAR principles')">
							<text class="menu-item-icon">📝</text>
							<text class="menu-item-text">Smart CV Builder</text>
							<svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M9 5L16 12L9 19" stroke="#9CA3AF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
							</svg>
						</view>
						<view class="drawer-menu-item" @tap="sendQuickMessage('Start a 3-question Customer Support situational mock interview')">
							<text class="menu-item-icon">🎙️</text>
							<text class="menu-item-text">AI Mock Interview Booth</text>
							<svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M9 5L16 12L9 19" stroke="#9CA3AF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
							</svg>
						</view>
					</view>
			
					<!-- History Area -->
					<scroll-view class="history-scroll" scroll-y>
						<!-- Last 7 Days -->
						<view class="history-group">
							<view class="group-title">Last 7 Days</view>
							<view class="history-item" @tap="sendQuickMessage('Help me generate a new English CV for a Customer Support Representative position')">
								<text class="history-item-text">Customer Support CV STAR Optimization</text>
								<view class="blue-dot"></view>
							</view>
							<view class="history-item" @tap="sendQuickMessage('Help me evaluate yesterday\'s IT Support mock interview recording')">
								<text class="history-item-text">IT Support Interview Feedback Report</text>
								<view class="blue-dot"></view>
							</view>
							<view class="history-item" @tap="sendQuickMessage('Query my latest payment and ledger details')">
								<text class="history-item-text">Kaspi.kz Paid Subscription Entitlement</text>
								<view class="blue-dot"></view>
							</view>
						</view>
			
						<!-- Earlier -->
						<view class="history-group" style="margin-top: 30rpx;">
							<view class="group-title">Earlier</view>
							<view class="history-item" @tap="sendQuickMessage('View my saved Remote Admin Assistant CV draft')">
								<text class="history-item-text">Remote Admin Assistant CV Draft</text>
								<view class="blue-dot"></view>
							</view>
							<view class="history-item" @tap="sendQuickMessage('How to map common Kazakh and Russian terms used in Central Asian customer service into an English CV?')">
								<text class="history-item-text">Central Asian Localization Glossary</text>
								<view class="blue-dot"></view>
							</view>
						</view>
					</scroll-view>
			
					<!-- Bottom User Info -->
					<view class="drawer-footer">
						<view class="drawer-user-info" @tap="handleUserClick">
							<image src="/static/default_avatar.png" mode="aspectFill" class="user-avatar-img"></image>
							<view class="user-meta">
								<text class="user-name">{{ isLoggedIn ? (userInfo.display_name || userInfo.user_id || 'User') : 'Login' }}</text>
								<text class="user-sub">{{ isLoggedIn ? 'View profile & settings' : 'Unlock more features' }}</text>
							</view>
						</view>
						<!-- Action buttons: scan, notifications -->
						<view class="user-action-icons">
							<view class="footer-icon-btn" @tap.stop="simulateScan">
								<!-- QR Scan SVG -->
								<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M3 9V5C3 3.89543 3.89543 3 5 3H9M15 3H19C20.1046 3 21 3.89543 21 5V9M21 15V19C21 20.1046 20.1046 21 19 21H15M9 21H5C3.89543 21 3 20.1046 3 19V15" stroke="#4B5563" stroke-width="2" stroke-linecap="round"/>
									<rect x="7" y="7" width="3" height="3" stroke="#4B5563" stroke-width="2"/>
									<rect x="14" y="7" width="3" height="3" stroke="#4B5563" stroke-width="2"/>
									<rect x="7" y="14" width="3" height="3" stroke="#4B5563" stroke-width="2"/>
									<rect x="14" y="14" width="3" height="3" stroke="#4B5563" stroke-width="2"/>
								</svg>
							</view>
							<view class="footer-icon-btn" @tap.stop="simulateNotify">
								<!-- Bell SVG -->
								<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" stroke="#4B5563" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
								</svg>
							</view>
						</view>
					</view>
				</view>
			</u-popup>
		</view>
		

		<!-- Chat Messages Area -->
		<scroll-view class="chat-body" scroll-y :scroll-top="scrollTop" scroll-with-animation>
			<view class="chat-container">
				<!-- Welcome Greeting -->
				<view v-if="messages.length === 0" class="welcome-section">
					<view class="welcome-logo">
						<image src="/static/kazi_avatar.png" mode="aspectFill" class="welcome-avatar-img"></image>
					</view>
					<view class="welcome-title">I'm Kazi</view>
					<view class="welcome-subtitle">Your AI companion for smart resume analysis, mock interviews, and career readiness assessment. Chat with me anytime.</view>
					
					<!-- Suggested Bubbles -->
					<view class="bubbles-container">
						<view 
							v-for="(bubble, index) in quickBubbles" 
							:key="index" 
							class="bubble-item" 
							@tap="sendQuickMessage(bubble)"
						>
							{{ bubble }}
						</view>
					</view>
				</view>

				<!-- Messages List -->
				<view v-else class="message-list">
					<view 
						v-for="(msg, index) in messages" 
						:key="index" 
						:class="['message-wrapper', msg.role]"
					>
						<!-- Avatar -->
						<image 
							:src="msg.role === 'user' ? '/static/default_avatar.png' : '/static/kazi_avatar.png'" 
							mode="aspectFill" 
							class="message-avatar"
						></image>
						
						<!-- Message Bubble -->
						<view class="message-bubble">
							<text class="message-text" style="white-space: pre-wrap;">{{ msg.content }}</text>
						</view>
					</view>
					
					<!-- Typing indicator -->
					<view v-if="isTyping" class="message-wrapper assistant typing">
						<image src="/static/kazi_avatar.png" mode="aspectFill" class="message-avatar"></image>
						<view class="message-bubble typing-bubble">
							<view class="dot-flashing"></view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>

		<!-- Bottom Action Area -->
		<view class="footer-area">
			<!-- Scrollable badges -->
			<scroll-view class="badges-scroll" scroll-x show-scrollbar="false">
				<view class="badges-wrapper">
					<view class="badge-item cv" @tap="sendQuickMessage('Help me diagnose my resume and optimize it in English using STAR principles')">
						<text class="badge-icon">✨</text>
						<text>Smart CV</text>
					</view>
					<view class="badge-item interview" @tap="sendQuickMessage('Start a 3-question Customer Support situational mock interview')">
						<text class="badge-icon">💬</text>
						<text>Mock Interview</text>
					</view>
					<view class="badge-item readiness" @tap="sendQuickMessage('Query my KaziSpace account entitlements and transaction ledger')">
						<text class="badge-icon">📊</text>
						<text>Readiness</text>
					</view>
				</view>
			</scroll-view>

			<!-- Input Box -->
			<view class="input-container">
				<!-- Voice Icon SVG -->
				<view class="input-icon-btn voice" @tap="simulateVoice">
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M12 2C10.3431 2 9 3.34315 9 5V12C9 13.6569 10.3431 15 12 15C13.6569 15 15 13.6569 15 12V5C15 3.34315 13.6569 2 12 2Z" stroke="#4B5563" stroke-width="2" stroke-linejoin="round"/>
						<path d="M19 10V12C19 15.866 15.866 19 12 19C8.13401 19 5 15.866 5 12V10" stroke="#4B5563" stroke-width="2" stroke-linecap="round"/>
						<path d="M12 19V22M8 22H16" stroke="#4B5563" stroke-width="2" stroke-linecap="round"/>
					</svg>
				</view>
				
				<!-- Text Input Field -->
				<input 
					type="text" 
					v-model="inputValue" 
					placeholder="Type a message or hold to speak..." 
					class="chat-input"
					confirm-type="send"
					@confirm="handleSend"
				/>

				<!-- Right side camera & plus buttons -->
				<view class="input-right-icons">
					<view class="input-icon-btn" @tap="simulatePhoto">
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M5 21H19C20.1046 21 21 20.1046 21 19V8C21 6.89543 20.1046 6 19 6H16.83L15.42 3.89C15.15 3.33 14.58 3 13.96 3H10.04C9.42 3 8.85 3.33 8.58 3.89L7.17 6H5C3.89543 6 3 6.89543 3 8V19C3 20.1046 3.89543 21 5 21Z" stroke="#4B5563" stroke-width="2" stroke-linejoin="round"/>
							<path d="M12 17C14.2091 17 16 15.2091 16 13C16 10.7909 14.2091 9 12 9C9.79086 9 8 10.7909 8 13C8 15.2091 9.79086 17 12 17Z" stroke="#4B5563" stroke-width="2" stroke-linejoin="round"/>
						</svg>
					</view>
					<view class="input-icon-btn" @tap="simulatePlus">
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M12 5V19M5 12H19" stroke="#4B5563" stroke-width="2" stroke-linecap="round"/>
						</svg>
					</view>
				</view>
			</view>
			
			<view class="footer-note">Content generated by AI</view>
		</view>
	</view>
</template>

<script>
import { mapState } from 'vuex';
	import { bindWebUser, sendChatMessage, fetchChatHistory } from '@/common/api.js';

	export default {
		data() {
			return {
				showDrawer: false,
				inputValue: '',
				messages: [],
				scrollTop: 0,
				isTyping: false,
				webUserId: '',
				chatSessionId: '',
				quickBubbles: [
					'Help me diagnose my resume and optimize it in English using STAR principles',
					'Start a 3-question Customer Support situational mock interview',
					'Query my KaziSpace account entitlements and transaction ledger'
				]
			};
		},
		computed: {
			...mapState(['isLoggedIn', 'userInfo'])
		},
		onLoad() {
			this.initGuestSession();
		},
		onShow() {
			if (this.isLoggedIn) {
				this.$store.dispatch('fetchUserProfile').catch(e => {
					console.error('Failed to sync user profile:', e);
				});
			}
		},
		methods: {
			handleUserClick() {
				this.showDrawer = false;
				if (this.isLoggedIn) {
					this.navigateTo('/pages/mine/mine');
				} else {
					this.navigateTo('/pages/login/login');
				}
			},
			async initGuestSession() {
				// 获取/生成 device_id
				let deviceId = uni.getStorageSync('device_id');
				if (!deviceId) {
					deviceId = this.generateUUID();
					uni.setStorageSync('device_id', deviceId);
				}
				
				// 获取/生成 web_user_id
				let webUserId = uni.getStorageSync('web_user_id');
				if (!webUserId) {
					webUserId = 'web_guest_' + this.generateUUID();
					uni.setStorageSync('web_user_id', webUserId);
				}
				this.webUserId = webUserId;
				
				// 获取本地缓存的会话 ID
				const storedSessionId = uni.getStorageSync('chat_session_id');
				if (storedSessionId) {
					this.chatSessionId = storedSessionId;
					this.loadHistory(storedSessionId);
				}
				
				// Bind guest user registration asynchronously without blocking UI
				try {
					await bindWebUser({
						web_user_id: webUserId
					});
				} catch (e) {
					console.error('Failed to bind guest user:', e);
				}
			},
			async loadHistory(sessionId) {
				this.isTyping = true;
				try {
					const history = await fetchChatHistory(sessionId);
					if (history && history.length > 0) {
						this.messages = history.map(item => ({
							role: item.role,
							content: item.content
						}));
						this.scrollToBottom();
					}
				} catch (e) {
					console.error('Failed to retrieve chat history:', e);
				} finally {
					this.isTyping = false;
				}
			},
			generateUUID() {
				return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
					var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
					return v.toString(16);
				});
			},
			toggleDrawer() {
				this.showDrawer = !this.showDrawer;
			},
			navigateTo(path) {
				this.showDrawer = false;
				uni.navigateTo({
					url: path
				});
			},
			resetChat() {
				this.messages = [];
				this.chatSessionId = '';
				uni.removeStorageSync('chat_session_id');
				this.showDrawer = false;
				uni.showToast({
					title: 'New conversation started',
					icon: 'none'
				});
			},
			sendQuickMessage(text) {
				this.showDrawer = false;
				this.inputValue = text;
				this.handleSend();
			},
			async handleSend() {
				if (!this.inputValue.trim()) return;
				
				const userContent = this.inputValue;
				this.messages.push({
					role: 'user',
					content: userContent
				});
				
				this.inputValue = '';
				this.scrollToBottom();
				
				this.isTyping = true;
				this.scrollToBottom();
				
				try {
					const res = await sendChatMessage({
						session_id: this.chatSessionId || null,
						content: userContent,
						web_user_id: this.webUserId
					});
					
					this.isTyping = false;
					
					if (res && res.assistant_response) {
						// Save and persist new session id
						if (res.session_id && res.session_id !== this.chatSessionId) {
							this.chatSessionId = res.session_id;
							uni.setStorageSync('chat_session_id', res.session_id);
						}
						
						this.messages.push({
							role: 'assistant',
							content: res.assistant_response.content
						});
					} else {
						uni.showToast({
							title: 'No response received',
							icon: 'none'
						});
					}
				} catch (e) {
					this.isTyping = false;
					uni.showToast({
						title: 'Failed to send message, please try again later',
						icon: 'none'
					});
				}
				this.scrollToBottom();
			},
			scrollToBottom() {
				this.$nextTick(() => {
					setTimeout(() => {
						this.scrollTop = this.scrollTop + 9999;
					}, 100);
				});
			},
			simulateVoice() {
				uni.showModal({
					title: 'Voice Input Simulation',
					content: '[Kazi Voice Input Simulation] Transcribing your spoken Kazakh/Russian/English words...',
					showCancel: false,
					confirmText: 'OK'
				});
			},
			simulatePhoto() {
				uni.showToast({
					title: 'Simulated opening camera to scan CV',
					icon: 'none'
				});
			},
			simulatePlus() {
				uni.showActionSheet({
					itemList: ['Send CV (.pdf)', 'Send cover letter (.docx)', 'Send readiness gap report'],
					success: (res) => {
						uni.showToast({
							title: `Selected: ${res.tapIndex === 0 ? 'PDF CV' : 'Document'}`,
							icon: 'none'
						});
					}
				});
			},
			simulateScan() {
				uni.showToast({
					title: 'Simulated launching Kaspi.kz QR Login',
					icon: 'none'
				});
			},
			simulateNotify() {
				uni.showToast({
					title: 'No new career notifications',
					icon: 'none'
				});
			}
		}
	}
</script>

<style lang="scss">
	.container {
		display: flex;
		flex-direction: column;
		height: 100vh;
		background-color: #f9fafb;
		/* #ifdef H5 */
		height: 100vh;
		/* #endif */
	}

	.header-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 88rpx;
		background-color: #ffffff;
		border-bottom: 1rpx solid #e5e7eb;
		padding: 0 30rpx;
		position: sticky;
		top: 0;
		z-index: 10;
		
		.header-left, .header-right {
			width: 60rpx;
			display: flex;
			align-items: center;
		}
		
		.header-center {
			font-size: 34rpx;
			font-weight: 700;
			color: #111827;
		}
	}

	.chat-body {
		flex: 1;
		overflow-y: scroll;
	}

	.chat-container {
		padding: 40rpx 30rpx;
	}

	.welcome-section {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-top: 60rpx;
		margin-bottom: 60rpx;
		
		.welcome-logo {
			width: 140rpx;
			height: 140rpx;
			background-color: #f3f4f6;
			border-radius: 70rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			margin-bottom: 30rpx;
			box-shadow: 0 4rpx 15rpx rgba(0, 0, 0, 0.03);
			border: 1rpx solid #e5e7eb;
			
			.welcome-avatar-img {
				width: 136rpx;
				height: 136rpx;
				border-radius: 68rpx;
			}
		}
		
		.welcome-title {
			font-size: 40rpx;
			font-weight: 800;
			color: #111827;
			margin-bottom: 16rpx;
		}
		
		.welcome-subtitle {
			font-size: 26rpx;
			color: #6b7280;
			text-align: center;
			line-height: 40rpx;
			padding: 0 40rpx;
			margin-bottom: 50rpx;
		}
	}

	.bubbles-container {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		
		.bubble-item {
			width: 90%;
			background-color: #ffffff;
			border: 1rpx solid #e5e7eb;
			border-radius: 24rpx;
			padding: 26rpx 32rpx;
			margin-bottom: 24rpx;
			font-size: 28rpx;
			color: #1f2937;
			box-shadow: 0 4rpx 15rpx rgba(0, 0, 0, 0.015);
			transition: all 0.2s ease;
			
			&:active {
				background-color: #f3f4f6;
				transform: scale(0.99);
			}
		}
	}

	.message-list {
		display: flex;
		flex-direction: column;
	}

	.message-wrapper {
		display: flex;
		margin-bottom: 40rpx;
		
		.message-avatar {
			width: 80rpx;
			height: 80rpx;
			border-radius: 40rpx;
			margin-right: 20rpx;
			background-color: #e5e7eb;
			flex-shrink: 0;
		}
		
		.message-bubble {
			max-width: 75%;
			background-color: #ffffff;
			border: 1rpx solid #e5e7eb;
			border-radius: 0 32rpx 32rpx 32rpx;
			padding: 24rpx 30rpx;
			
			.message-text {
				font-size: 29rpx;
				color: #1f2937;
				line-height: 46rpx;
			}
		}
		
		&.user {
			flex-direction: row-reverse;
			
			.message-avatar {
				margin-right: 0;
				margin-left: 20rpx;
			}
			
			.message-bubble {
				background-color: #2563eb;
				border-color: #2563eb;
				border-radius: 32rpx 0 32rpx 32rpx;
				
				.message-text {
					color: #ffffff;
				}
			}
		}
	}

	/* Typing loading dots */
	.typing-bubble {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 80rpx;
		padding: 0 40rpx;
	}

	.dot-flashing {
		position: relative;
		width: 12rpx;
		height: 12rpx;
		border-radius: 6rpx;
		background-color: #3b82f6;
		color: #3b82f6;
		animation: dotFlashing 1s infinite linear alternate;
		animation-delay: .5s;
		
		&::before, &::after {
			content: '';
			display: inline-block;
			position: absolute;
			top: 0;
		}
		
		&::before {
			left: -20rpx;
			width: 12rpx;
			height: 12rpx;
			border-radius: 6rpx;
			background-color: #3b82f6;
			color: #3b82f6;
			animation: dotFlashing 1s infinite alternate;
			animation-delay: 0s;
		}
		
		&::after {
			left: 20rpx;
			width: 12rpx;
			height: 12rpx;
			border-radius: 6rpx;
			background-color: #3b82f6;
			color: #3b82f6;
			animation: dotFlashing 1s infinite alternate;
			animation-delay: 1s;
		}
	}

	@keyframes dotFlashing {
		0% { background-color: #3b82f6; }
		50%, 100% { background-color: #e5e7eb; }
	}

	.footer-area {
		padding: 20rpx 30rpx 40rpx 30rpx;
		background-color: #ffffff;
		border-top: 1rpx solid #f3f4f6;
	}

	.badges-scroll {
		width: 100%;
		white-space: nowrap;
		margin-bottom: 24rpx;
		
		.badges-wrapper {
			display: flex;
			padding: 4rpx 0;
		}
		
		.badge-item {
			display: inline-flex;
			align-items: center;
			padding: 14rpx 28rpx;
			border-radius: 30rpx;
			margin-right: 20rpx;
			font-size: 26rpx;
			font-weight: 500;
			flex-shrink: 0;
			
			.badge-icon {
				margin-right: 8rpx;
				font-size: 28rpx;
			}
			
			&.cv {
				background-color: rgba(59, 130, 246, 0.07);
				color: #2563eb;
			}
			
			&.interview {
				background-color: rgba(16, 185, 129, 0.07);
				color: #059669;
			}
			
			&.readiness {
				background-color: rgba(245, 158, 11, 0.07);
				color: #d97706;
			}
		}
	}

	.input-container {
		display: flex;
		align-items: center;
		border: 1rpx solid #d1d5db;
		border-radius: 48rpx;
		padding: 10rpx 24rpx;
		background-color: #f9fafb;
		height: 90rpx;
		box-sizing: border-box;
		
		.chat-input {
			flex: 1;
			font-size: 28rpx;
			color: #1f2937;
			padding: 0 16rpx;
		}
		
		.input-right-icons {
			display: flex;
			align-items: center;
		}
		
		.input-icon-btn {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 60rpx;
			height: 60rpx;
			border-radius: 30rpx;
			margin-left: 10rpx;
			
			&:active {
				background-color: #e5e7eb;
			}
			
			&.voice {
				margin-left: 0;
				margin-right: 10rpx;
			}
		}
	}

	.footer-note {
		text-align: center;
		font-size: 22rpx;
		color: #9ca3af;
		margin-top: 16rpx;
	}

	/* 抽屉样式 */
	.drawer-content {
		width: 600rpx;
		height: 100vh;
		background-color: #ffffff;
		display: flex;
		flex-direction: column;
		padding: 40rpx 30rpx;
		box-sizing: border-box;
	}

	.drawer-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 20rpx;
		margin-bottom: 40rpx;
		
		.drawer-title {
			font-size: 44rpx;
			font-weight: 800;
			color: #111827;
			letter-spacing: 1rpx;
		}
		
		.search-icon-btn {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 60rpx;
			height: 60rpx;
			border-radius: 30rpx;
			
			&:active {
				background-color: #f3f4f6;
			}
		}
	}

	.new-chat-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #f3f4f6;
		color: #1f2937;
		font-size: 28rpx;
		font-weight: 600;
		height: 88rpx;
		border-radius: 44rpx;
		margin-bottom: 40rpx;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.01);
		
		&:active {
			background-color: #e5e7eb;
		}
	}

	.drawer-menu-list {
		border-bottom: 1rpx solid #f3f4f6;
		padding-bottom: 20rpx;
		margin-bottom: 30rpx;
	}

	.drawer-menu-item {
		display: flex;
		align-items: center;
		padding: 24rpx 10rpx;
		border-radius: 16rpx;
		margin-bottom: 10rpx;
		
		&:active {
			background-color: #f9fafb;
		}
		
		.menu-item-icon {
			font-size: 34rpx;
			margin-right: 20rpx;
			width: 44rpx;
			text-align: center;
		}
		
		.menu-item-text {
			flex: 1;
			font-size: 28rpx;
			color: #374151;
			font-weight: 500;
		}
	}

	.history-scroll {
		flex: 1;
		overflow-y: scroll;
	}

	.history-group {
		.group-title {
			font-size: 24rpx;
			color: #9ca3af;
			font-weight: 600;
			margin-bottom: 16rpx;
			padding-left: 10rpx;
		}
		
		.history-item {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 24rpx 10rpx;
			border-radius: 12rpx;
			
			&:active {
				background-color: #f9fafb;
			}
			
			.history-item-text {
				flex: 1;
				font-size: 27rpx;
				color: #4b5563;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				padding-right: 20rpx;
			}
			
			.blue-dot {
				width: 10rpx;
				height: 10rpx;
				border-radius: 5rpx;
				background-color: #2563eb;
				flex-shrink: 0;
			}
		}
	}

	.drawer-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-top: 30rpx;
		border-top: 1rpx solid #f3f4f6;
		background-color: #ffffff;
		margin-top: 20rpx;
		
		.drawer-user-info {
			display: flex;
			align-items: center;
			flex: 1;
			
			.user-avatar-img {
				width: 80rpx;
				height: 80rpx;
				border-radius: 40rpx;
				margin-right: 20rpx;
				border: 2rpx solid #e5e7eb;
			}
			
			.user-meta {
				display: flex;
				flex-direction: column;
				
				.user-name {
					font-size: 28rpx;
					font-weight: 700;
					color: #1f2937;
				}
				
				.user-sub {
					font-size: 22rpx;
					color: #9ca3af;
					margin-top: 4rpx;
				}
			}
		}
		
		.user-action-icons {
			display: flex;
			align-items: center;
		}
		
		.footer-icon-btn {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 60rpx;
			height: 60rpx;
			border-radius: 30rpx;
			margin-left: 10rpx;
			
			&:active {
				background-color: #f3f4f6;
			}
		}
	}
</style>