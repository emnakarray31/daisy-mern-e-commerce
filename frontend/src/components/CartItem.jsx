import { Link } from "react-router-dom";
import { useCartStore } from "../stores/useCartStore";

const CartItem = ({ item }) => {
	const { removeFromCart, updateQuantity } = useCartStore();

	const mainImage = item.images?.[0] || item.image;

	return (
		<div style={{
			display: 'flex',
			gap: '20px',
			padding: '25px',
			background: '#fff',
			borderRadius: '8px',
			boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
			marginBottom: '20px',
			transition: 'all 0.3s'
		}}
		onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)'}
		onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)'}
		> 
			<div style={{ flexShrink: 0 }}>
				<Link to={`/product/${item._id}`}>
					<img
						src={mainImage}
						alt={item.name}
						style={{
							width: '120px',
							height: '120px',
							objectFit: 'cover',
							borderRadius: '6px',
							transition: 'transform 0.3s'
						}}
						onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
						onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
					/>
				</Link>
			</div>
 
			<div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
				<div> 
					<span style={{
						fontSize: '11px',
						color: '#999',
						textTransform: 'uppercase',
						letterSpacing: '1px'
					}}>
						{item.category}
					</span>
 
					<h5 style={{ margin: '5px 0 8px' }}>
						<Link
							to={`/product/${item._id}`}
							style={{
								color: '#111',
								textDecoration: 'none',
								fontSize: '16px',
								fontWeight: '600',
								transition: 'color 0.3s'
							}}
							onMouseEnter={(e) => e.target.style.color = '#e53637'}
							onMouseLeave={(e) => e.target.style.color = '#111'}
						>
							{item.name}
						</Link>
					</h5>
 
					<div style={{ display: 'flex', gap: '15px', fontSize: '13px', color: '#666' }}>
						{item.selectedSize && (
							<span>Size: <strong>{item.selectedSize}</strong></span>
						)}
						{item.selectedColor && (
							<span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
								Color: 
								<span style={{
									width: '16px',
									height: '16px',
									borderRadius: '50%',
									background: item.selectedColor,
									display: 'inline-block',
									border: '1px solid #e5e5e5'
								}}></span>
							</span>
						)}
					</div>
				</div>
 
				<div style={{
					display: 'flex',
					alignItems: 'center',
					gap: '15px',
					marginTop: '15px'
				}}>
					<div style={{
						display: 'flex',
						alignItems: 'center',
						border: '1px solid #e5e5e5',
						borderRadius: '4px',
						overflow: 'hidden'
					}}>
						<button
							onClick={() => updateQuantity(item._id, item.quantity - 1)}
							style={{
								width: '35px',
								height: '35px',
								border: 'none',
								background: '#f5f5f5',
								cursor: 'pointer',
								fontSize: '16px',
								color: '#111',
								transition: 'all 0.2s',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center'
							}}
							onMouseEnter={(e) => e.target.style.background = '#e5e5e5'}
							onMouseLeave={(e) => e.target.style.background = '#f5f5f5'}
						>
							<i className="fa fa-minus" style={{ fontSize: '10px' }}></i>
						</button>
						<span style={{
							width: '50px',
							textAlign: 'center',
							fontWeight: '600',
							fontSize: '14px'
						}}>
							{item.quantity}
						</span>
						<button
							onClick={() => updateQuantity(item._id, item.quantity + 1)}
							style={{
								width: '35px',
								height: '35px',
								border: 'none',
								background: '#f5f5f5',
								cursor: 'pointer',
								fontSize: '16px',
								color: '#111',
								transition: 'all 0.2s',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center'
							}}
							onMouseEnter={(e) => e.target.style.background = '#e5e5e5'}
							onMouseLeave={(e) => e.target.style.background = '#f5f5f5'}
						>
							<i className="fa fa-plus" style={{ fontSize: '10px' }}></i>
						</button>
					</div>
 
					<button
						onClick={() => removeFromCart(item._id)}
						style={{
							background: 'none',
							border: 'none',
							color: '#999',
							cursor: 'pointer',
							fontSize: '13px',
							display: 'flex',
							alignItems: 'center',
							gap: '5px',
							transition: 'color 0.3s',
							padding: '5px 10px'
						}}
						onMouseEnter={(e) => e.target.style.color = '#e53637'}
						onMouseLeave={(e) => e.target.style.color = '#999'}
					>
						<i className="fa fa-trash-o"></i>
						Remove
					</button>
				</div>
			</div>
 
			<div style={{
				textAlign: 'right',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'space-between',
				alignItems: 'flex-end',
				minWidth: '100px'
			}}> 
				<div>
					<span style={{
						fontSize: '12px',
						color: '#999',
						display: 'block'
					}}>
						${item.price.toFixed(2)} each
					</span>
				</div> 
				<div>
					<span style={{
						fontSize: '20px',
						fontWeight: '700',
						color: '#111'
					}}>
						${(item.price * item.quantity).toFixed(2)}
					</span>
				</div>
			</div>
		</div>
	);
};

export default CartItem;