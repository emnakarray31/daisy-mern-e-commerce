import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SimpleSearchOverlay = ({ isOpen, onClose }) => {
	const [searchQuery, setSearchQuery] = useState("");
	const navigate = useNavigate();

	const handleSubmit = (e) => {
		e.preventDefault();
		if (searchQuery.trim()) {
			navigate(`/category/all?search=${encodeURIComponent(searchQuery.trim())}`);
			onClose();
			setSearchQuery("");
		}
	};

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
					zIndex: 9998,
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
						animation: 'slideUp 0.3s ease'
					}}
				>
					<form onSubmit={handleSubmit}>
						<div style={{
							position: 'relative',
							width: '500px',
							maxWidth: '90vw'
						}}>
							<input
								type="text"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								placeholder="Search products..."
								autoFocus
								style={{
									width: '100%',
									padding: '18px 60px 18px 20px',
									border: 'none',
									borderRadius: '0',
									fontSize: '16px',
									outline: 'none',
									boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
									background: '#fff',
									color: '#111'
								}}
							/>
							<button
								type="submit"
								style={{
									position: 'absolute',
									right: '8px',
									top: '50%',
									transform: 'translateY(-50%)',
									background: '#e53637',
									color: '#fff',
									border: 'none',
									width: '45px',
									height: '45px',
									borderRadius: '50%',
									cursor: 'pointer',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									transition: 'all 0.3s'
								}}
								onMouseEnter={(e) => {
									e.target.style.background = '#ca2829';
									e.target.style.transform = 'translateY(-50%) scale(1.1)';
								}}
								onMouseLeave={(e) => {
									e.target.style.background = '#e53637';
									e.target.style.transform = 'translateY(-50%) scale(1)';
								}}
							>
								<i className="fa fa-search" style={{fontSize: '16px'}}></i>
							</button>
						</div>
					</form>
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

export default SimpleSearchOverlay;