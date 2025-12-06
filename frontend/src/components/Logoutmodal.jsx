const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
	if (!isOpen) return null;

	return (
		<>
		 
			<div 
				onClick={onClose}
				style={{
					position: 'fixed',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					background: 'rgba(0, 0, 0, 0.6)',
					zIndex: 9999,
					animation: 'fadeIn 0.2s ease',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					padding: '20px'
				}}
			> 
				<div 
					onClick={(e) => e.stopPropagation()}
					style={{
						background: '#fff',
						width: '100%',
						maxWidth: '400px',
						padding: '40px',
						animation: 'slideUp 0.3s ease',
						textAlign: 'center'
					}}
				> 
					<div style={{
						width: '60px',
						height: '60px',
						borderRadius: '50%',
						background: '#f5f5f5',
						margin: '0 auto 25px',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center'
					}}>
						<i className="fa fa-sign-out" style={{
							fontSize: '24px',
							color: '#111'
						}}></i>
					</div> 
					<h3 style={{
						fontSize: '22px',
						fontWeight: '700',
						color: '#111',
						marginBottom: '15px',
						textTransform: 'uppercase',
						letterSpacing: '1px'
					}}>
						Sign Out
					</h3> 
					<p style={{
						fontSize: '14px',
						color: '#666',
						marginBottom: '30px',
						lineHeight: '1.6'
					}}>
						Are you sure you want to log out? You will need to sign in again to access your account.
					</p> 
					<div style={{
						display: 'grid',
						gridTemplateColumns: '1fr 1fr',
						gap: '15px'
					}}>
						<button
							onClick={onClose}
							style={{
								padding: '14px',
								background: '#f5f5f5',
								color: '#666',
								border: 'none',
								fontSize: '13px',
								fontWeight: '700',
								cursor: 'pointer',
								transition: 'all 0.3s',
								textTransform: 'uppercase',
								letterSpacing: '1px'
							}}
							onMouseEnter={(e) => e.target.style.background = '#e5e5e5'}
							onMouseLeave={(e) => e.target.style.background = '#f5f5f5'}
						>
							Cancel
						</button>
						<button
							onClick={() => {
								onConfirm();
								onClose();
							}}
							style={{
								padding: '14px',
								background: '#2d2d2d',
								color: '#fff',
								border: 'none',
								fontSize: '13px',
								fontWeight: '700',
								cursor: 'pointer',
								transition: 'all 0.3s',
								textTransform: 'uppercase',
								letterSpacing: '1px'
							}}
							onMouseEnter={(e) => e.target.style.background = '#111'}
							onMouseLeave={(e) => e.target.style.background = '#2d2d2d'}
						>
							Sign Out
						</button>
					</div>
				</div>
			</div> 
			<style>{`
				@keyframes fadeIn {
					from { opacity: 0; }
					to { opacity: 1; }
				}
				@keyframes slideUp {
					from {
						opacity: 0;
						transform: translateY(20px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}
			`}</style>
		</>
	);
};

export default LogoutModal;