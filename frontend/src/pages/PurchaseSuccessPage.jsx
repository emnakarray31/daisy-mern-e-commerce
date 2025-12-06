import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "../stores/useCartStore";
import { motion } from "framer-motion";

const PurchaseSuccessPage = () => {
	const { clearCart } = useCartStore();

	useEffect(() => {
		 
		clearCart();
	}, [clearCart]);

	return (
		<div style={{
			minHeight: '100vh',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
			padding: '40px 20px'
		}}>
			<motion.div
				initial={{ opacity: 0, scale: 0.9 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.5 }}
				style={{
					background: '#fff',
					padding: '60px 40px',
					borderRadius: '20px',
					boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
					textAlign: 'center',
					maxWidth: '600px',
					width: '100%'
				}}
			>
				 
				<motion.div
					initial={{ scale: 0 }}
					animate={{ scale: 1 }}
					transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
					style={{
						width: '100px',
						height: '100px',
						borderRadius: '50%',
						background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
						margin: '0 auto 30px',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						boxShadow: '0 10px 30px rgba(16, 185, 129, 0.3)'
					}}
				>
					<i className="fa fa-check" style={{
						fontSize: '50px',
						color: '#fff'
					}}></i>
				</motion.div>

				{/* Success Message */}
				<motion.h1
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3 }}
					style={{
						fontSize: '36px',
						fontWeight: '700',
						color: '#111',
						marginBottom: '15px',
						textTransform: 'uppercase',
						letterSpacing: '1px'
					}}
				>
					Order Confirmed!
				</motion.h1>

				<motion.p
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4 }}
					style={{
						fontSize: '16px',
						color: '#666',
						lineHeight: '1.6',
						marginBottom: '10px'
					}}
				>
					Thank you for your purchase! Your order has been successfully placed.
				</motion.p>

				<motion.p
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.5 }}
					style={{
						fontSize: '14px',
						color: '#999',
						marginBottom: '40px'
					}}
				>
					We've sent a confirmation email with your order details.
				</motion.p>

				{/* Order Info */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.6 }}
					style={{
						background: '#f9f9f9',
						padding: '25px',
						borderRadius: '12px',
						marginBottom: '30px'
					}}
				>
					<div style={{
						display: 'grid',
						gridTemplateColumns: '1fr 1fr',
						gap: '15px',
						textAlign: 'left'
					}}>
						<div>
							<p style={{
								fontSize: '12px',
								color: '#999',
								marginBottom: '5px',
								textTransform: 'uppercase',
								letterSpacing: '0.5px'
							}}>
								Order Number
							</p>
							<p style={{
								fontSize: '16px',
								fontWeight: '700',
								color: '#111',
								margin: 0
							}}>
								#{Math.floor(Math.random() * 1000000)}
							</p>
						</div>
						<div>
							<p style={{
								fontSize: '12px',
								color: '#999',
								marginBottom: '5px',
								textTransform: 'uppercase',
								letterSpacing: '0.5px'
							}}>
								Estimated Delivery
							</p>
							<p style={{
								fontSize: '16px',
								fontWeight: '700',
								color: '#111',
								margin: 0
							}}>
								3-5 Business Days
							</p>
						</div>
					</div>
				</motion.div>

				 
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.7 }}
					style={{
						display: 'grid',
						gridTemplateColumns: '1fr 1fr',
						gap: '15px'
					}}
				>
					<Link
						to="/"
						style={{
							padding: '15px',
							background: '#f5f5f5',
							color: '#111',
							textDecoration: 'none',
							fontWeight: '700',
							fontSize: '14px',
							textTransform: 'uppercase',
							letterSpacing: '1px',
							transition: 'all 0.3s',
							borderRadius: '8px',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							gap: '8px'
						}}
						onMouseEnter={(e) => e.target.style.background = '#e5e5e5'}
						onMouseLeave={(e) => e.target.style.background = '#f5f5f5'}
					>
						<i className="fa fa-home"></i>
						Home
					</Link>

					<Link
						to="/category/all"
						style={{
							padding: '15px',
							background: '#2d2d2d',
							color: '#fff',
							textDecoration: 'none',
							fontWeight: '700',
							fontSize: '14px',
							textTransform: 'uppercase',
							letterSpacing: '1px',
							transition: 'all 0.3s',
							borderRadius: '8px',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							gap: '8px'
						}}
						onMouseEnter={(e) => e.target.style.background = '#111'}
						onMouseLeave={(e) => e.target.style.background = '#2d2d2d'}
					>
						<i className="fa fa-shopping-bag"></i>
						Continue Shopping
					</Link>
				</motion.div>

				 
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.8 }}
					style={{
						marginTop: '40px',
						paddingTop: '25px',
						borderTop: '1px solid #e5e5e5'
					}}
				>
					<p style={{
						fontSize: '13px',
						color: '#999',
						marginBottom: '15px'
					}}>
						Need help with your order?
					</p>
					<a
						href="mailto:support@daisyandmore.com"
						style={{
							fontSize: '14px',
							color: '#e53637',
							textDecoration: 'none',
							fontWeight: '600'
						}}
					>
						<i className="fa fa-envelope" style={{marginRight: '8px'}}></i>
						Contact Support
					</a>
				</motion.div>
			</motion.div>
		</div>
	);
};

export default PurchaseSuccessPage;