import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../stores/useCartStore';
import { useUserStore } from '../stores/useUserStore';
import axios from '../lib/axios';
import toast from 'react-hot-toast';

const Chatbot = () => {
	const navigate = useNavigate();
	const { addToCart } = useCartStore();
	const { user } = useUserStore();
	
	const [isOpen, setIsOpen] = useState(false);
	const [messages, setMessages] = useState([
		{
			role: 'assistant',
			content: "Hi! I'm Daisy, your shopping assistant. I can help you find products! Try asking: 'Show me jeans' or 'Find shoes under $50' 👋",
			timestamp: new Date().toISOString()
		}
	]);
	const [inputMessage, setInputMessage] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [suggestions, setSuggestions] = useState([]);
	const messagesEndRef = useRef(null);
	const inputRef = useRef(null);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	useEffect(() => {
		if (isOpen) {
			inputRef.current?.focus();
			if (messages.length === 1 && suggestions.length === 0) {
				loadSuggestions();
			}
		}
	}, [isOpen]);

	const loadSuggestions = async () => {
		try {
			const res = await axios.get('/chatbot/suggestions');
			setSuggestions(res.data.suggestions);
		} catch (error) {
			console.error('Failed to load suggestions:', error);
		}
	};

	const sendMessage = async (messageText = inputMessage) => {
		if (!messageText.trim() || isLoading) return;

		const userMessage = {
			role: 'user',
			content: messageText,
			timestamp: new Date().toISOString()
		};

		setMessages(prev => [...prev, userMessage]);
		setInputMessage('');
		setIsLoading(true);
		setSuggestions([]);

		try {
			const conversationHistory = messages.map(msg => ({
				role: msg.role,
				content: msg.content
			}));

			const res = await axios.post('/chatbot', {
				message: messageText,
				conversationHistory
			});

			const aiMessage = {
				role: 'assistant',
				content: res.data.message,
				products: res.data.products, 
				timestamp: res.data.timestamp
			};

			setMessages(prev => [...prev, aiMessage]);
		} catch (error) {
			console.error('Chatbot error:', error);
			
			const errorMessage = {
				role: 'assistant',
				content: error.response?.data?.message || "Sorry, I'm having trouble responding. Please try again.",
				timestamp: new Date().toISOString(),
				isError: true
			};

			setMessages(prev => [...prev, errorMessage]);
		} finally {
			setIsLoading(false);
		}
	};

	const handleSuggestionClick = (suggestion) => {
		sendMessage(suggestion);
	};

	const handleKeyPress = (e) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			sendMessage();
		}
	};

	const clearConversation = () => {
		setMessages([
			{
				role: 'assistant',
				content: "Conversation cleared! How can I help you today? 👋",
				timestamp: new Date().toISOString()
			}
		]);
		loadSuggestions();
	};

	const handleViewProduct = (productId) => {
		navigate(`/product/${productId}`);
		setIsOpen(false);
	};

	const handleAddToCart = (product) => {
		if (!user) {
			toast.error('Please login to add items to cart');
			navigate('/login');
			return;
		}
		
		addToCart(product, '', '', 1);
		toast.success('Added to cart!');
	};

	return (
		<>
			 
			<div
				onClick={() => setIsOpen(!isOpen)}
				style={{
					position: 'fixed',
					bottom: '30px',
					right: '30px',
					width: '60px',
					height: '60px',
					background: isOpen ? '#895129' : '#e53637',
					borderRadius: '50%',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					cursor: 'pointer',
					boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
					transition: 'all 0.3s',
					zIndex: 9998,
					 
				}}
				onMouseEnter={(e) => {
					e.currentTarget.style.transform = 'scale(1.1)';
					e.currentTarget.style.boxShadow = '0 6px 30px rgba(0,0,0,0.4)';
				}}
				onMouseLeave={(e) => {
					e.currentTarget.style.transform = 'scale(1)';
					e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
				}}
			>
				{isOpen ? (
					<i className="fa fa-times" style={{ fontSize: '24px', color: '#fff' }}></i>
				) : (
					<i className="fa fa-comments" style={{ fontSize: '24px', color: '#fff' }}></i>
				)}
				
				{!isOpen && messages.length === 1 && (
					<div style={{
						position: 'absolute',
						top: '-5px',
						right: '-5px',
						width: '20px',
						height: '20px',
						background: '#fff',
						border: '2px solid #e53637',
						borderRadius: '50%',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						fontSize: '10px',
						fontWeight: '700',
						color: '#e53637',
						animation: 'bounce 1s infinite'
					}}>
						1
					</div>
				)}
			</div>
 
			{isOpen && (
				<div style={{
					position: 'fixed',
					bottom: '110px',
					right: '30px',
					width: '400px',
					height: '480px',
					background: '#fff',
					borderRadius: '16px',
					boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
					display: 'flex',
					flexDirection: 'column',
					overflow: 'hidden',
					zIndex: 9999,
					animation: 'slideUp 0.3s ease'
				}}> 
					<div style={{
						background: 'linear-gradient(135deg, #895129 0%, #e53637 100%)',
						padding: '20px',
						color: '#fff',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between'
					}}>
						<div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
							<div style={{
								width: '40px',
								height: '40px',
								background: '#fff',
								borderRadius: '50%',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center'
							}}>
								<i className="fa fa-robot" style={{ fontSize: '20px', color: '#895129' }}></i>
							</div>
							<div>
								<h6 style={{ margin: 0, fontSize: '16px', fontWeight: '700' }}>
									Daisy Assistant
								</h6>
								<p style={{ margin: 0, fontSize: '11px', opacity: 0.9 }}>
									🛍️ Product Search Enabled
								</p>
							</div>
						</div>
						<button
							onClick={clearConversation}
							style={{
								background: 'rgba(255,255,255,0.2)',
								border: 'none',
								color: '#fff',
								width: '32px',
								height: '32px',
								borderRadius: '50%',
								cursor: 'pointer',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								transition: 'all 0.3s'
							}}
							title="Clear conversation"
							onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
							onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
						>
							<i className="fa fa-refresh" style={{ fontSize: '14px' }}></i>
						</button>
					</div>
 
					<div style={{
						flex: 1,
						overflowY: 'auto',
						padding: '20px',
						background: '#f9f9f9',
						display: 'flex',
						flexDirection: 'column',
						gap: '15px'
					}}>
						{messages.map((msg, idx) => (
							<div key={idx}> 
								<div style={{
									display: 'flex',
									justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
									animation: 'fadeIn 0.3s ease'
								}}>
									<div style={{
										maxWidth: '75%',
										padding: '12px 16px',
										borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
										background: msg.role === 'user' ? '#e53637' : '#fff',
										color: msg.role === 'user' ? '#fff' : '#333',
										boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
										fontSize: '14px',
										lineHeight: '1.6',
										border: msg.isError ? '1px solid #ff6b6b' : 'none'
									}}>
										{msg.content}
										<div style={{
											fontSize: '10px',
											opacity: 0.7,
											marginTop: '6px',
											textAlign: msg.role === 'user' ? 'right' : 'left'
										}}>
											{new Date(msg.timestamp).toLocaleTimeString('en-US', { 
												hour: '2-digit', 
												minute: '2-digit' 
											})}
										</div>
									</div>
								</div>
 
								{msg.products && msg.products.length > 0 && (
									<div style={{
										marginTop: '10px',
										display: 'flex',
										flexDirection: 'column',
										gap: '10px'
									}}>
										{msg.products.map((product, pIdx) => (
											<div 
												key={pIdx}
												style={{
													background: '#fff',
													borderRadius: '12px',
													padding: '12px',
													boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
													display: 'flex',
													gap: '12px',
													border: '1px solid #f0f0f0',
													transition: 'all 0.3s'
												}}
												onMouseEnter={(e) => {
													e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
													e.currentTarget.style.transform = 'translateY(-2px)';
												}}
												onMouseLeave={(e) => {
													e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
													e.currentTarget.style.transform = 'translateY(0)';
												}}
											>
											<div 
													onClick={() => handleViewProduct(product.id)}
													style={{
														width: '80px',
														height: '80px',
														borderRadius: '8px',
														overflow: 'hidden',
														flexShrink: 0,
														cursor: 'pointer',
														position: 'relative'
													}}
												>
													<img 
														src={product.image} 
														alt={product.name}
														style={{
															width: '100%',
															height: '100%',
															objectFit: 'cover'
														}}
													/>
													{product.discount > 0 && (
														<div style={{
															position: 'absolute',
															top: '5px',
															left: '5px',
															background: '#e53637',
															color: '#fff',
															padding: '2px 6px',
															borderRadius: '4px',
															fontSize: '10px',
															fontWeight: '700'
														}}>
															-{product.discount}%
														</div>
													)}
												</div>

												
												<div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
													<h6 
														onClick={() => handleViewProduct(product.id)}
														style={{
															margin: 0,
															fontSize: '13px',
															fontWeight: '600',
															color: '#111',
															cursor: 'pointer',
															lineHeight: '1.3'
														}}
														onMouseEnter={(e) => e.target.style.color = '#e53637'}
														onMouseLeave={(e) => e.target.style.color = '#111'}
													>
														{product.name}
													</h6>
													
													<p style={{
														margin: 0,
														fontSize: '11px',
														color: '#999',
														textTransform: 'capitalize'
													}}>
														{product.category}
													</p>

													<div style={{
														fontSize: '16px',
														fontWeight: '700',
														color: '#e53637',
														marginTop: '4px'
													}}>
														${product.price.toFixed(2)}
													</div>

											
													<div style={{
														display: 'flex',
														gap: '6px',
														marginTop: '6px'
													}}>
														<button
															onClick={() => handleViewProduct(product.id)}
															style={{
																flex: 1,
																padding: '6px 10px',
																background: '#fff',
																border: '1px solid #e5e5e5',
																borderRadius: '6px',
																fontSize: '11px',
																fontWeight: '600',
																color: '#333',
																cursor: 'pointer',
																transition: 'all 0.3s'
															}}
															onMouseEnter={(e) => {
																e.currentTarget.style.borderColor = '#895129';
																e.currentTarget.style.color = '#895129';
															}}
															onMouseLeave={(e) => {
																e.currentTarget.style.borderColor = '#e5e5e5';
																e.currentTarget.style.color = '#333';
															}}
														>
															<i className="fa fa-eye" style={{ marginRight: '4px' }}></i>
															View
														</button>
														
														<button
															onClick={() => handleAddToCart(product)}
															disabled={!product.inStock}
															style={{
																flex: 1,
																padding: '6px 10px',
																background: product.inStock ? '#e53637' : '#ccc',
																border: 'none',
																borderRadius: '6px',
																fontSize: '11px',
																fontWeight: '600',
																color: '#fff',
																cursor: product.inStock ? 'pointer' : 'not-allowed',
																transition: 'all 0.3s'
															}}
															onMouseEnter={(e) => {
																if (product.inStock) e.currentTarget.style.background = '#c92a2a';
															}}
															onMouseLeave={(e) => {
																if (product.inStock) e.currentTarget.style.background = '#e53637';
															}}
														>
															<i className="fa fa-shopping-cart" style={{ marginRight: '4px' }}></i>
															{product.inStock ? 'Add' : 'Out'}
														</button>
													</div>
												</div>
											</div>
										))}
									</div>
								)}
							</div>
						))}
 
						{isLoading && (
							<div style={{ display: 'flex', justifyContent: 'flex-start' }}>
								<div style={{
									padding: '12px 16px',
									borderRadius: '16px 16px 16px 4px',
									background: '#fff',
									boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
									display: 'flex',
									gap: '4px'
								}}>
									<div className="typing-dot"></div>
									<div className="typing-dot"></div>
									<div className="typing-dot"></div>
								</div>
							</div>
						)} 
						{suggestions.length > 0 && messages.length <= 2 && !isLoading && (
							<div style={{
								display: 'flex',
								flexDirection: 'column',
								gap: '8px',
								marginTop: '10px'
							}}>
								<p style={{
									fontSize: '12px',
									color: '#666',
									margin: 0,
									textAlign: 'center'
								}}>
									💡 Try these:
								</p>
								{suggestions.slice(0, 4).map((suggestion, idx) => (
									<button
										key={idx}
										onClick={() => handleSuggestionClick(suggestion)}
										style={{
											padding: '10px 14px',
											background: '#fff',
											border: '1px solid #e5e5e5',
											borderRadius: '8px',
											fontSize: '13px',
											color: '#333',
											cursor: 'pointer',
											textAlign: 'left',
											transition: 'all 0.3s',
											boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
										}}
										onMouseEnter={(e) => {
											e.currentTarget.style.borderColor = '#895129';
											e.currentTarget.style.transform = 'translateX(4px)';
										}}
										onMouseLeave={(e) => {
											e.currentTarget.style.borderColor = '#e5e5e5';
											e.currentTarget.style.transform = 'translateX(0)';
										}}
									>
										{suggestion}
									</button>
								))}
							</div>
						)}

						<div ref={messagesEndRef} />
					</div>
 
					<div style={{
						padding: '16px',
						background: '#fff',
						borderTop: '1px solid #e5e5e5',
						display: 'flex',
						gap: '10px'
					}}>
						<input
							ref={inputRef}
							type="text"
							value={inputMessage}
							onChange={(e) => setInputMessage(e.target.value)}
							onKeyPress={handleKeyPress}
							placeholder="Ask me to find products..."
							disabled={isLoading}
							style={{
								flex: 1,
								padding: '12px 16px',
								border: '1px solid #e5e5e5',
								borderRadius: '24px',
								fontSize: '14px',
								outline: 'none',
								transition: 'border-color 0.3s',
								background: isLoading ? '#f9f9f9' : '#fff'
							}}
							onFocus={(e) => e.target.style.borderColor = '#895129'}
							onBlur={(e) => e.target.style.borderColor = '#e5e5e5'}
						/>
						<button
							onClick={() => sendMessage()}
							disabled={!inputMessage.trim() || isLoading}
							style={{
								width: '46px',
								height: '46px',
								borderRadius: '50%',
								background: !inputMessage.trim() || isLoading ? '#ccc' : '#e53637',
								border: 'none',
								color: '#fff',
								cursor: !inputMessage.trim() || isLoading ? 'not-allowed' : 'pointer',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								transition: 'all 0.3s',
								flexShrink: 0
							}}
							onMouseEnter={(e) => {
								if (inputMessage.trim() && !isLoading) {
									e.currentTarget.style.background = '#c92a2a';
									e.currentTarget.style.transform = 'scale(1.05)';
								}
							}}
							onMouseLeave={(e) => {
								if (inputMessage.trim() && !isLoading) {
									e.currentTarget.style.background = '#e53637';
									e.currentTarget.style.transform = 'scale(1)';
								}
							}}
						>
							<i className={isLoading ? "fa fa-spinner fa-spin" : "fa fa-paper-plane"} 
							   style={{ fontSize: '16px' }}></i>
						</button>
					</div>
				</div>
			)} 
			<style>{`
				@keyframes pulse {
					0%, 100% { box-shadow: 0 4px 20px rgba(229, 54, 55, 0.4); }
					50% { box-shadow: 0 4px 30px rgba(229, 54, 55, 0.6); }
				}
				@keyframes bounce {
					0%, 100% { transform: translateY(0); }
					50% { transform: translateY(-4px); }
				}
				@keyframes slideUp {
					from { opacity: 0; transform: translateY(20px); }
					to { opacity: 1; transform: translateY(0); }
				}
				@keyframes fadeIn {
					from { opacity: 0; }
					to { opacity: 1; }
				}
				.typing-dot {
					width: 8px;
					height: 8px;
					background: #895129;
					border-radius: 50%;
					animation: typing 1.4s infinite;
				}
				.typing-dot:nth-child(2) { animation-delay: 0.2s; }
				.typing-dot:nth-child(3) { animation-delay: 0.4s; }
				@keyframes typing {
					0%, 60%, 100% { transform: translateY(0); opacity: 0.7; }
					30% { transform: translateY(-8px); opacity: 1; }
				}
			`}</style>
		</>
	);
};

export default Chatbot;