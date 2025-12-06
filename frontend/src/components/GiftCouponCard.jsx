import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const GiftCouponCard = ({ coupon, onApply, compact = false }) => {
	const [copied, setCopied] = useState(false);

	if (!coupon) return null;

	const copyToClipboard = () => {
		navigator.clipboard.writeText(coupon.code);
		setCopied(true);
		toast.success("Coupon code copied!");
		setTimeout(() => setCopied(false), 2000);
	};

	const getTypeIcon = () => {
		switch (coupon.type) {
			case 'percentage':
				return 'fa-percent';
			case 'fixed':
				return 'fa-dollar';
			case 'freeShipping':
				return 'fa-truck';
			default:
				return 'fa-tag';
		}
	};

	const getTypeColor = () => {
		switch (coupon.type) {
			case 'percentage':
				return '#e53637';
			case 'fixed':
				return '#10b981';
			case 'freeShipping':
				return '#3b82f6';
			default:
				return '#666';
		}
	};

	const getDiscountText = () => {
		switch (coupon.type) {
			case 'percentage':
				return `${coupon.discountValue}% OFF`;
			case 'fixed':
				return `$${coupon.discountValue} OFF`;
			case 'freeShipping':
				return 'FREE SHIPPING';
			default:
				if (coupon.discountPercentage) {
					return `${coupon.discountPercentage}% OFF`;
				}
				return 'DISCOUNT';
		}
	};

	const getDaysRemaining = () => {
		if (!coupon.expirationDate) return null;
		const now = new Date();
		const expiry = new Date(coupon.expirationDate);
		const diffTime = expiry - now;
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		return diffDays;
	};

	const daysRemaining = getDaysRemaining();
	const isExpiringSoon = daysRemaining !== null && daysRemaining <= 3;
	const typeColor = getTypeColor();
 
	if (compact) {
		return (
			<div style={{
				display: 'flex',
				alignItems: 'center',
				gap: '12px',
				padding: '12px 15px',
				background: '#f9f9f9',
				borderRadius: '8px',
				border: '1px dashed #ddd'
			}}> 
				<div style={{
					width: '36px',
					height: '36px',
					borderRadius: '50%',
					background: typeColor,
					color: '#fff',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					flexShrink: 0
				}}>
					<i className={`fa ${getTypeIcon()}`} style={{ fontSize: '14px' }}></i>
				</div> 
				<div style={{ flex: 1 }}>
					<div style={{
						fontSize: '14px',
						fontWeight: '700',
						color: '#111'
					}}>
						{getDiscountText()}
					</div>
					<div style={{
						fontSize: '11px',
						color: '#666'
					}}>
						Code: <span style={{ fontFamily: 'monospace', fontWeight: '600' }}>{coupon.code}</span>
					</div>
				</div> 
				{onApply && (
					<button
						onClick={() => onApply(coupon.code)}
						style={{
							padding: '6px 12px',
							background: '#111',
							color: '#fff',
							border: 'none',
							borderRadius: '4px',
							fontSize: '12px',
							fontWeight: '600',
							cursor: 'pointer',
							transition: 'all 0.3s'
						}}
						onMouseEnter={(e) => e.target.style.background = '#e53637'}
						onMouseLeave={(e) => e.target.style.background = '#111'}
					>
						Apply
					</button>
				)}
			</div>
		);
	} 
	return (
		<div style={{
			background: '#fff',
			borderRadius: '12px',
			overflow: 'hidden',
			boxShadow: '0 2px 15px rgba(0,0,0,0.08)',
			border: '1px solid #f0f0f0',
			transition: 'all 0.3s'
		}}
		onMouseEnter={(e) => {
			e.currentTarget.style.transform = 'translateY(-5px)';
			e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.12)';
		}}
		onMouseLeave={(e) => {
			e.currentTarget.style.transform = 'translateY(0)';
			e.currentTarget.style.boxShadow = '0 2px 15px rgba(0,0,0,0.08)';
		}}
		> 
			<div style={{
				background: `linear-gradient(135deg, ${typeColor} 0%, ${typeColor}dd 100%)`,
				padding: '20px',
				color: '#fff',
				position: 'relative',
				overflow: 'hidden'
			}}> 
				<div style={{
					position: 'absolute',
					top: '-20px',
					right: '-20px',
					width: '80px',
					height: '80px',
					borderRadius: '50%',
					background: 'rgba(255,255,255,0.1)'
				}}></div> 
				<div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
					<div style={{
						width: '45px',
						height: '45px',
						borderRadius: '50%',
						background: 'rgba(255,255,255,0.2)',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center'
					}}>
						<i className={`fa ${getTypeIcon()}`} style={{ fontSize: '18px' }}></i>
					</div>
					<div>
						<div style={{
							fontSize: '24px',
							fontWeight: '700',
							textShadow: '0 2px 4px rgba(0,0,0,0.2)'
						}}>
							{getDiscountText()}
						</div>
						{coupon.description && (
							<div style={{ fontSize: '13px', opacity: 0.9 }}>
								{coupon.description}
							</div>
						)}
					</div>
				</div>
			</div> 
			<div style={{ padding: '20px' }}> 
				<div style={{
					display: 'flex',
					alignItems: 'center',
					gap: '10px',
					marginBottom: '15px'
				}}>
					<div style={{
						flex: 1,
						background: '#f5f5f5',
						border: '2px dashed #ddd',
						borderRadius: '6px',
						padding: '10px 15px',
						fontFamily: 'monospace',
						fontSize: '16px',
						fontWeight: '700',
						color: '#111',
						letterSpacing: '2px',
						textAlign: 'center'
					}}>
						{coupon.code}
					</div>
					<button
						onClick={copyToClipboard}
						style={{
							padding: '10px 16px',
							background: copied ? '#10b981' : '#111',
							color: '#fff',
							border: 'none',
							borderRadius: '6px',
							cursor: 'pointer',
							transition: 'all 0.3s',
							fontSize: '14px'
						}}
					>
						{copied ? <i className="fa fa-check"></i> : <i className="fa fa-copy"></i>}
					</button>
				</div>
 
				<div style={{
					fontSize: '13px',
					color: '#666',
					display: 'flex',
					flexDirection: 'column',
					gap: '8px'
				}}> 
					{coupon.minimumPurchase > 0 && (
						<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
							<i className="fa fa-shopping-cart" style={{ width: '16px', color: '#999' }}></i>
							Min. purchase: <strong style={{ color: '#111' }}>${coupon.minimumPurchase.toFixed(2)}</strong>
						</div>
					)}
 
					{daysRemaining !== null && (
						<div style={{
							display: 'flex',
							alignItems: 'center',
							gap: '8px',
							color: isExpiringSoon ? '#e53637' : '#666'
						}}>
							<i className="fa fa-clock-o" style={{ width: '16px' }}></i>
							{isExpiringSoon ? (
								<strong>
									{daysRemaining <= 0 ? 'Expires today!' : `Expires in ${daysRemaining} day${daysRemaining > 1 ? 's' : ''}!`}
								</strong>
							) : (
								<>Expires: {new Date(coupon.expirationDate).toLocaleDateString()}</>
							)}
						</div>
					)}
				</div>
 
				{onApply && (
					<button
						onClick={() => onApply(coupon.code)}
						style={{
							width: '100%',
							padding: '12px',
							background: '#111',
							color: '#fff',
							border: 'none',
							borderRadius: '6px',
							fontSize: '14px',
							fontWeight: '700',
							cursor: 'pointer',
							marginTop: '15px',
							transition: 'all 0.3s',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							gap: '8px'
						}}
						onMouseEnter={(e) => e.target.style.background = '#e53637'}
						onMouseLeave={(e) => e.target.style.background = '#111'}
					>
						<i className="fa fa-tag"></i>
						Apply This Coupon
					</button>
				)}
			</div>
		</div>
	);
};

export default GiftCouponCard;