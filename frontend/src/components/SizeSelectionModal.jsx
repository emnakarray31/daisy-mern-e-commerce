import { useState } from "react";

const SizeSelectionModal = ({ isOpen, onClose, product, onAddToCart }) => {
	const [selectedSize, setSelectedSize] = useState("");
	const [selectedColor, setSelectedColor] = useState("");

	if (!isOpen || !product) return null;
 
	const hasVariants = product.variants && product.variants.length > 0;
	const hasColors = product.colors && product.colors.length > 0;
 
	const availableSizes = hasVariants 
		? [...new Set(product.variants.filter(v => v.stock > 0).map(v => v.size))]
		: [];
 
	const handleDirectAdd = () => {
		onAddToCart(product);
		onClose();
	};

	const handleAddWithSize = () => {
		if (hasVariants && !selectedSize) {
			alert("Please select a size");
			return;
		}

		onAddToCart({
			...product,
			selectedSize: selectedSize || null,
			selectedColor: selectedColor || (hasColors ? product.colors[0] : null)
		});
		
		setSelectedSize("");
		setSelectedColor("");
		onClose();
	};

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
						maxWidth: '500px',
						maxHeight: '90vh',
						overflowY: 'auto',
						animation: 'slideUp 0.3s ease',
						boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)'
					}}
				> 
					<div style={{
						padding: '20px 25px',
						borderBottom: '1px solid #e5e5e5',
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						background: '#f9f9f9'
					}}>
						<h3 style={{
							margin: 0,
							fontSize: '18px',
							fontWeight: '700',
							color: '#111'
						}}>
							Select Options
						</h3>
						<button
							onClick={onClose}
							style={{
								background: 'none',
								border: 'none',
								fontSize: '24px',
								color: '#999',
								cursor: 'pointer',
								padding: '0',
								lineHeight: '1'
							}}
						>
							×
						</button>
					</div>
 
					<div style={{padding: '25px'}}> 
						<div style={{
							display: 'flex',
							gap: '15px',
							marginBottom: '25px',
							paddingBottom: '25px',
							borderBottom: '1px solid #f0f0f0'
						}}>
							<div style={{
								width: '100px',
								height: '100px',
								flexShrink: 0,
								background: '#f5f5f5'
							}}>
								<img 
									src={product.image} 
									alt={product.name}
									style={{
										width: '100%',
										height: '100%',
										objectFit: 'cover'
									}}
								/>
							</div>
							<div>
								<h4 style={{
									margin: '0 0 8px 0',
									fontSize: '16px',
									fontWeight: '600',
									color: '#111'
								}}>
									{product.name}
								</h4>
								<p style={{
									margin: '0 0 8px 0',
									fontSize: '20px',
									fontWeight: '700',
									color: '#e53637'
								}}>
									${product.price.toFixed(2)}
								</p>
								{product.totalStock > 0 ? (
									<span style={{
										fontSize: '12px',
										color: '#10b981',
										fontWeight: '600'
									}}>
										<i className="fa fa-check-circle" style={{marginRight: '5px'}}></i>
										In Stock
									</span>
								) : (
									<span style={{
										fontSize: '12px',
										color: '#ef4444',
										fontWeight: '600'
									}}>
										<i className="fa fa-times-circle" style={{marginRight: '5px'}}></i>
										Out of Stock
									</span>
								)}
							</div>
						</div>
 
						{hasVariants && availableSizes.length > 0 && (
							<div style={{marginBottom: '25px'}}>
								<label style={{
									display: 'block',
									fontSize: '14px',
									fontWeight: '700',
									color: '#111',
									marginBottom: '12px',
									textTransform: 'uppercase',
									letterSpacing: '0.5px'
								}}>
									Select Size <span style={{color: '#e53637'}}>*</span>
								</label>
								<div style={{
									display: 'flex',
									flexWrap: 'wrap',
									gap: '10px'
								}}>
									{availableSizes.map((size, idx) => {
										const variant = product.variants.find(v => v.size === size);
										const isLowStock = variant && variant.stock <= 5;
										
										return (
											<button
												key={idx}
												onClick={() => setSelectedSize(size)}
												style={{
													padding: '12px 20px',
													border: selectedSize === size ? '2px solid #e53637' : '2px solid #e5e5e5',
													background: selectedSize === size ? '#fff9f9' : '#fff',
													color: selectedSize === size ? '#e53637' : '#111',
													cursor: 'pointer',
													fontSize: '14px',
													fontWeight: selectedSize === size ? '700' : '600',
													transition: 'all 0.2s',
													position: 'relative'
												}}
												onMouseEnter={(e) => {
													if (selectedSize !== size) {
														e.target.style.borderColor = '#ccc';
													}
												}}
												onMouseLeave={(e) => {
													if (selectedSize !== size) {
														e.target.style.borderColor = '#e5e5e5';
													}
												}}
											>
												{size}
												{isLowStock && (
													<span style={{
														position: 'absolute',
														top: '-8px',
														right: '-8px',
														background: '#f59e0b',
														color: '#fff',
														fontSize: '9px',
														padding: '2px 5px',
														borderRadius: '3px',
														fontWeight: '700'
													}}>
														LOW
													</span>
												)}
											</button>
										);
									})}
								</div>
							</div>
						)}
 
						{hasColors && (
							<div style={{marginBottom: '25px'}}>
								<label style={{
									display: 'block',
									fontSize: '14px',
									fontWeight: '700',
									color: '#111',
									marginBottom: '12px',
									textTransform: 'uppercase',
									letterSpacing: '0.5px'
								}}>
									Select Color
								</label>
								<div style={{
									display: 'flex',
									flexWrap: 'wrap',
									gap: '10px'
								}}>
									{product.colors.slice(0, 5).map((color, idx) => (
										<button
											key={idx}
											onClick={() => setSelectedColor(color)}
											style={{
												width: '40px',
												height: '40px',
												border: selectedColor === color ? '3px solid #e53637' : '2px solid #e5e5e5',
												background: color,
												cursor: 'pointer',
												transition: 'all 0.2s',
												position: 'relative'
											}}
											title={color}
										>
											{selectedColor === color && (
												<i className="fa fa-check" style={{
													color: color === '#ffffff' || color === 'white' ? '#111' : '#fff',
													fontSize: '16px'
												}}></i>
											)}
										</button>
									))}
								</div>
							</div>
						)} 
						<button
							onClick={hasVariants ? handleAddWithSize : handleDirectAdd}
							disabled={product.totalStock === 0}
							style={{
								width: '100%',
								padding: '16px',
								background: product.totalStock === 0 ? '#ccc' : '#e53637',
								color: '#fff',
								border: 'none',
								fontSize: '15px',
								fontWeight: '700',
								cursor: product.totalStock === 0 ? 'not-allowed' : 'pointer',
								transition: 'all 0.3s',
								textTransform: 'uppercase',
								letterSpacing: '1px'
							}}
							onMouseEnter={(e) => {
								if (product.totalStock > 0) {
									e.target.style.background = '#ca2829';
								}
							}}
							onMouseLeave={(e) => {
								if (product.totalStock > 0) {
									e.target.style.background = '#e53637';
								}
							}}
						>
							<i className="fa fa-shopping-bag" style={{marginRight: '10px'}}></i>
							{product.totalStock === 0 ? 'Out of Stock' : 'Add to Cart'}
						</button>
 
						{hasVariants && (
							<p style={{
								marginTop: '15px',
								fontSize: '12px',
								color: '#999',
								textAlign: 'center',
								margin: '15px 0 0 0'
							}}>
								<i className="fa fa-info-circle" style={{marginRight: '5px'}}></i>
								Please select a size before adding to cart
							</p>
						)}
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
						transform: translateY(30px);
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

export default SizeSelectionModal;