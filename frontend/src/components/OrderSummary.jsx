import { useState } from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "../stores/useCartStore";

const OrderSummary = ({ showCheckoutButton = true }) => {
	const { 
		subtotal, 
		total, 
		coupon, 
		isCouponApplied,
		isFreeShipping,
		applyCoupon, 
		removeCoupon 
	} = useCartStore();

	const [couponCode, setCouponCode] = useState("");
	const [isApplying, setIsApplying] = useState(false);

	const shippingCost = isFreeShipping ? 0 : (subtotal >= 75 ? 0 : 7.99);
	const savings = subtotal - total;

	const handleApplyCoupon = async () => {
		if (!couponCode.trim()) return;
		
		setIsApplying(true);
		await applyCoupon(couponCode.trim());
		setIsApplying(false);
		setCouponCode("");
	};

	const handleRemoveCoupon = () => {
		removeCoupon();
	}; 
	const getCouponDiscountText = () => {
		if (!coupon) return "";
		
		switch (coupon.type) {
			case 'percentage':
				return `${coupon.discountValue}% off`;
			case 'fixed':
				return `$${coupon.discountValue} off`;
			case 'freeShipping':
				return 'Free shipping';
			default:
				if (coupon.discountPercentage) {
					return `${coupon.discountPercentage}% off`;
				}
				return "";
		}
	};

	return (
		<div style={{
			background: '#fff',
			borderRadius: '8px',
			boxShadow: '0 2px 15px rgba(0,0,0,0.08)',
			padding: '30px',
			position: 'sticky',
			top: '20px'
		}}> 
			<h4 style={{
				fontSize: '20px',
				fontWeight: '700',
				color: '#111',
				marginBottom: '25px',
				paddingBottom: '15px',
				borderBottom: '2px solid #f5f5f5'
			}}>
				Order Summary
			</h4> 
			<div style={{
				display: 'flex',
				justifyContent: 'space-between',
				marginBottom: '15px',
				fontSize: '15px'
			}}>
				<span style={{ color: '#666' }}>Subtotal</span>
				<span style={{ fontWeight: '600', color: '#111' }}>${subtotal.toFixed(2)}</span>
			</div>
 
			{isCouponApplied && savings > 0 && (
				<div style={{
					display: 'flex',
					justifyContent: 'space-between',
					marginBottom: '15px',
					fontSize: '15px'
				}}>
					<span style={{ color: '#10b981' }}>
						<i className="fa fa-tag" style={{ marginRight: '5px' }}></i>
						Discount ({getCouponDiscountText()})
					</span>
					<span style={{ fontWeight: '600', color: '#10b981' }}>-${savings.toFixed(2)}</span>
				</div>
			)}
 
			<div style={{
				display: 'flex',
				justifyContent: 'space-between',
				marginBottom: '15px',
				fontSize: '15px'
			}}>
				<span style={{ color: '#666' }}>Shipping</span>
				{shippingCost === 0 ? (
					<span style={{ fontWeight: '600', color: '#10b981' }}>
						FREE
						{isFreeShipping && <i className="fa fa-truck" style={{ marginLeft: '5px' }}></i>}
					</span>
				) : (
					<span style={{ fontWeight: '600', color: '#111' }}>${shippingCost.toFixed(2)}</span>
				)}
			</div> 
			{!isFreeShipping && subtotal < 75 && (
				<div style={{
					background: '#fef3c7',
					borderRadius: '6px',
					padding: '12px 15px',
					marginBottom: '20px'
				}}>
					<div style={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						marginBottom: '8px'
					}}>
						<span style={{ fontSize: '13px', color: '#b45309' }}>
							<i className="fa fa-truck" style={{ marginRight: '5px' }}></i>
							Add ${(75 - subtotal).toFixed(2)} more for FREE shipping
						</span>
					</div>
					<div style={{
						background: '#fde68a',
						borderRadius: '10px',
						height: '6px',
						overflow: 'hidden'
					}}>
						<div style={{
							background: '#f59e0b',
							height: '100%',
							width: `${Math.min((subtotal / 75) * 100, 100)}%`,
							borderRadius: '10px',
							transition: 'width 0.3s'
						}}></div>
					</div>
				</div>
			)} 
			<div style={{
				borderTop: '2px solid #f5f5f5',
				margin: '20px 0',
				paddingTop: '20px'
			}}> 
				<div style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					marginBottom: '25px'
				}}>
					<span style={{ fontSize: '18px', fontWeight: '700', color: '#111' }}>Total</span>
					<span style={{ fontSize: '24px', fontWeight: '700', color: '#e53637' }}>
						${(total + shippingCost).toFixed(2)}
					</span>
				</div>
			</div> 
			<div style={{ marginBottom: '25px' }}>
				<label style={{
					display: 'block',
					fontSize: '14px',
					fontWeight: '600',
					color: '#111',
					marginBottom: '10px'
				}}>
					<i className="fa fa-ticket" style={{ marginRight: '8px', color: '#e53637' }}></i>
					Discount Code
				</label>

				{isCouponApplied && coupon ? (
					<div style={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						background: '#ecfdf5',
						border: '1px solid #10b981',
						borderRadius: '6px',
						padding: '12px 15px'
					}}>
						<div>
							<span style={{
								fontFamily: 'monospace',
								fontWeight: '700',
								color: '#111',
								fontSize: '15px'
							}}>
								{coupon.code}
							</span>
							<span style={{
								marginLeft: '10px',
								fontSize: '13px',
								color: '#10b981'
							}}>
								({getCouponDiscountText()})
							</span>
						</div>
						<button
							onClick={handleRemoveCoupon}
							style={{
								background: 'none',
								border: 'none',
								color: '#ef4444',
								cursor: 'pointer',
								fontSize: '13px',
								fontWeight: '600'
							}}
						>
							<i className="fa fa-times"></i> Remove
						</button>
					</div>
				) : ( 
					<div style={{ display: 'flex', gap: '10px' }}>
						<input
							type="text"
							value={couponCode}
							onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
							placeholder="Enter code"
							style={{
								flex: 1,
								padding: '12px 15px',
								border: '1px solid #e5e5e5',
								borderRadius: '6px',
								fontSize: '14px',
								fontFamily: 'monospace',
								textTransform: 'uppercase',
								outline: 'none',
								transition: 'border-color 0.3s'
							}}
							onFocus={(e) => e.target.style.borderColor = '#111'}
							onBlur={(e) => e.target.style.borderColor = '#e5e5e5'}
							onKeyPress={(e) => e.key === 'Enter' && handleApplyCoupon()}
						/>
						<button
							onClick={handleApplyCoupon}
							disabled={isApplying || !couponCode.trim()}
							style={{
								padding: '12px 20px',
								background: isApplying || !couponCode.trim() ? '#ccc' : '#111',
								color: '#fff',
								border: 'none',
								borderRadius: '6px',
								fontWeight: '600',
								fontSize: '14px',
								cursor: isApplying || !couponCode.trim() ? 'not-allowed' : 'pointer',
								transition: 'all 0.3s'
							}}
						>
							{isApplying ? (
								<i className="fa fa-spinner fa-spin"></i>
							) : (
								'Apply'
							)}
						</button>
					</div>
				)} 
				<Link
					to="/my-coupons"
					style={{
						display: 'block',
						marginTop: '10px',
						fontSize: '13px',
						color: '#666',
						textDecoration: 'none'
					}}
					onMouseEnter={(e) => e.target.style.color = '#e53637'}
					onMouseLeave={(e) => e.target.style.color = '#666'}
				>
					<i className="fa fa-gift" style={{ marginRight: '5px' }}></i>
					View my available coupons
				</Link>
			</div>
 
			{showCheckoutButton && (
				<Link
					to="/checkout"
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						gap: '10px',
						width: '100%',
						padding: '16px',
						background: '#111',
						color: '#fff',
						textDecoration: 'none',
						borderRadius: '6px',
						fontSize: '16px',
						fontWeight: '700',
						transition: 'all 0.3s'
					}}
					onMouseEnter={(e) => e.target.style.background = '#e53637'}
					onMouseLeave={(e) => e.target.style.background = '#111'}
				>
					<i className="fa fa-lock"></i>
					Proceed to Checkout
				</Link>
			)}
 
			<div style={{
				marginTop: '25px',
				paddingTop: '20px',
				borderTop: '1px solid #f5f5f5'
			}}>
				<div style={{
					display: 'flex',
					justifyContent: 'center',
					gap: '20px',
					marginBottom: '15px'
				}}>
					<div style={{ textAlign: 'center' }}>
						<i className="fa fa-shield" style={{ fontSize: '20px', color: '#10b981', marginBottom: '5px', display: 'block' }}></i>
						<span style={{ fontSize: '11px', color: '#666' }}>Secure Payment</span>
					</div>
					<div style={{ textAlign: 'center' }}>
						<i className="fa fa-refresh" style={{ fontSize: '20px', color: '#10b981', marginBottom: '5px', display: 'block' }}></i>
						<span style={{ fontSize: '11px', color: '#666' }}>30-Day Returns</span>
					</div>
					<div style={{ textAlign: 'center' }}>
						<i className="fa fa-truck" style={{ fontSize: '20px', color: '#10b981', marginBottom: '5px', display: 'block' }}></i>
						<span style={{ fontSize: '11px', color: '#666' }}>Fast Delivery</span>
					</div>
				</div> 
				<div style={{ textAlign: 'center' }}>
					<img 
						src="/img/payment.png" 
						alt="Payment methods" 
						style={{ maxWidth: '200px', opacity: 0.7 }}
					/>
				</div>
			</div>
		</div>
	);
};

export default OrderSummary;