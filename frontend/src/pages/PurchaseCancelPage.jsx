import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const PurchaseCancelPage = () => {
	return (
		<div style={{
			minHeight: '100vh',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
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
						background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
						margin: '0 auto 30px',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						boxShadow: '0 10px 30px rgba(239, 68, 68, 0.3)'
					}}
				>
					<i className="fa fa-times" style={{
						fontSize: '50px',
						color: '#fff'
					}}></i>
				</motion.div>

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
					Order Cancelled
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
					Your order has been cancelled. No charges have been made to your account.
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
					Your items are still in your cart if you'd like to complete your purchase.
				</motion.p>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.6 }}
					style={{
						background: '#f9f9f9',
						padding: '25px',
						borderRadius: '12px',
						marginBottom: '30px',
						textAlign: 'left'
					}}
				>
					<h3 style={{
						fontSize: '16px',
						fontWeight: '700',
						color: '#111',
						marginBottom: '15px'
					}}>
						<i className="fa fa-info-circle" style={{marginRight: '10px', color: '#e53637'}}></i>
						Why was my payment cancelled?
					</h3>
					<ul style={{
						margin: 0,
						paddingLeft: '20px',
						fontSize: '14px',
						color: '#666',
						lineHeight: '1.8'
					}}>
						<li>You closed the payment window</li>
						<li>Payment information was incomplete</li>
						<li>You clicked the back button</li>
						<li>Session timeout occurred</li>
					</ul>
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
						to="/cart"
						style={{
							padding: '15px',
							background: '#e53637',
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
						onMouseEnter={(e) => e.target.style.background = '#ca2829'}
						onMouseLeave={(e) => e.target.style.background = '#e53637'}
					>
						<i className="fa fa-shopping-cart"></i>
						View Cart
					</Link>

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
						Need assistance with your purchase?
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

export default PurchaseCancelPage;