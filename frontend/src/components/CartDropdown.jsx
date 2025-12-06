import { Link } from "react-router-dom";
import { useCartStore } from "../stores/useCartStore";
const CartDropdown = () => {
	const { cart, removeFromCart } = useCartStore();
	const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

	return (
		<div 
			className="cart-dropdown"
			style={{
				position: 'absolute',
				top: '100%',
				right: '0',
				width: '350px',
				maxHeight: '450px',
				background: '#fff',
				boxShadow: '0 5px 25px rgba(0, 0, 0, 0.15)',
				zIndex: 1000,
				marginTop: '15px',
				opacity: 0,
				visibility: 'hidden',
				transition: 'all 0.3s ease',
				pointerEvents: 'none'
			}}
		>
			{cart.length === 0 ? (
				<div style={{
					padding: '40px 20px',
					textAlign: 'center'
				}}>
					<i className="fa fa-shopping-bag" style={{
						fontSize: '48px',
						color: '#e5e5e5',
						marginBottom: '15px',
						display: 'block'
					}}></i>
					<p style={{
						color: '#999',
						fontSize: '14px',
						margin: 0
					}}>
						Your cart is empty
					</p>
				</div>
			) : (
				<> 
					<div style={{
						padding: '15px 20px',
						borderBottom: '1px solid #e5e5e5',
						background: '#f9f9f9'
					}}>
						<div style={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center'
						}}>
							<span style={{
								fontSize: '14px',
								fontWeight: '700',
								color: '#111'
							}}>
								Shopping Cart ({cart.length})
							</span>
						</div>
					</div> 
					<div style={{
						maxHeight: '280px',
						overflowY: 'auto',
						padding: '10px'
					}}>
						{cart.map((item) => (
							<div 
								key={item._id}
								style={{
									display: 'flex',
									gap: '12px',
									padding: '10px',
									borderBottom: '1px solid #f5f5f5',
									transition: 'background 0.2s'
								}}
								onMouseEnter={(e) => e.currentTarget.style.background = '#fafafa'}
								onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
							> 
								<div style={{
									width: '70px',
									height: '70px',
									flexShrink: 0,
									background: '#f5f5f5'
								}}>
									<img 
										src={item.image} 
										alt={item.name}
										style={{
											width: '100%',
											height: '100%',
											objectFit: 'cover'
										}}
									/>
								</div>
								<div style={{
									flex: 1,
									minWidth: 0
								}}>
									<h6 style={{
										fontSize: '13px',
										fontWeight: '600',
										color: '#111',
										margin: '0 0 5px 0',
										overflow: 'hidden',
										textOverflow: 'ellipsis',
										whiteSpace: 'nowrap'
									}}>
										{item.name}
									</h6>
									<div style={{
										display: 'flex',
										justifyContent: 'space-between',
										alignItems: 'center',
										marginTop: '8px'
									}}>
										<span style={{
											fontSize: '12px',
											color: '#666'
										}}>
											Qty: {item.quantity}
										</span>
										<span style={{
											fontSize: '14px',
											fontWeight: '700',
											color: '#e53637'
										}}>
											${(item.price * item.quantity).toFixed(2)}
										</span>
									</div>
								</div>
 
								<button
									onClick={() => removeFromCart(item._id)}
									style={{
										background: 'none',
										border: 'none',
										cursor: 'pointer',
										padding: '5px',
										color: '#999',
										fontSize: '16px',
										transition: 'color 0.2s'
									}}
									onMouseEnter={(e) => e.target.style.color = '#e53637'}
									onMouseLeave={(e) => e.target.style.color = '#999'}
								>
									<i className="fa fa-times"></i>
								</button>
							</div>
						))}
					</div>
 
					<div style={{
						padding: '15px 20px',
						borderTop: '1px solid #e5e5e5',
						background: '#f9f9f9'
					}}>
						<div style={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							marginBottom: '15px'
						}}>
							<span style={{
								fontSize: '14px',
								fontWeight: '700',
								color: '#111'
							}}>
								Subtotal:
							</span>
							<span style={{
								fontSize: '18px',
								fontWeight: '700',
								color: '#e53637'
							}}>
								${total.toFixed(2)}
							</span>
						</div>

						<Link 
							to="/cart"
							style={{
								display: 'block',
								width: '100%',
								padding: '12px',
								background: '#e53637',
								color: '#fff',
								textAlign: 'center',
								textDecoration: 'none',
								fontSize: '14px',
								fontWeight: '700',
								transition: 'background 0.3s',
								textTransform: 'uppercase',
								letterSpacing: '0.5px'
							}}
							onMouseEnter={(e) => e.target.style.background = '#ca2829'}
							onMouseLeave={(e) => e.target.style.background = '#e53637'}
						>
							View Cart
						</Link>
					</div>
				</>
			)}
			<style>{`
				.cart-dropdown::-webkit-scrollbar {
					width: 6px;
				}
				.cart-dropdown::-webkit-scrollbar-track {
					background: #f5f5f5;
				}
				.cart-dropdown::-webkit-scrollbar-thumb {
					background: #ccc;
					border-radius: 3px;
				}
				.cart-dropdown::-webkit-scrollbar-thumb:hover {
					background: #999;
				}
			`}</style>
		</div>
	);
};
export default CartDropdown;