import toast from "react-hot-toast";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";
import { useWishlistStore } from "../stores/Usewishliststore";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import SizeSelectionModal from "./SizeSelectionModal";

const ProductCard = ({ product }) => {
	const { user } = useUserStore();
	const { addToCart } = useCartStore();
	const { toggleWishlist, checkInWishlist } = useWishlistStore();
	const navigate = useNavigate();
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const [isInWishlist, setIsInWishlist] = useState(false);
	const [showSizeModal, setShowSizeModal] = useState(false); 
	const allImages = product.images && product.images.length > 0 
		? product.images 
		: [product.image];
 
	useEffect(() => {
		if (user) {
			setIsInWishlist(checkInWishlist(product._id));
		}
	}, [product._id, user, checkInWishlist]);
	
	const handleAddToCart = (e) => {
		e.preventDefault();
		e.stopPropagation();
		
		if (!user) {
			toast.error("Please login to add items to cart", { 
				id: "login"
			});
			return;
		}
		const hasVariants = product.variants && product.variants.length > 0;
		if (hasVariants) { 
			setShowSizeModal(true);
		} else { 
			addToCart(product);
		}
	};

	const handleAddToCartWithOptions = (productWithOptions) => {
		addToCart(productWithOptions);
	};

	const handleWishlist = async (e) => {
		e.preventDefault();
		e.stopPropagation();
		
		if (!user) {
			toast.error("Please login to add items to wishlist", { id: "login" });
			navigate("/login");
			return;
		}

		const success = await toggleWishlist(product._id);
		if (success) {
			setIsInWishlist(!isInWishlist);
		}
	};

	const handleCardClick = () => {
		navigate(`/product/${product._id}`);
	};

	const handlePrevImage = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setCurrentImageIndex((prev) => 
			prev === 0 ? allImages.length - 1 : prev - 1
		);
	};

	const handleNextImage = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setCurrentImageIndex((prev) => 
			prev === allImages.length - 1 ? 0 : prev + 1
		);
	};

	return (
		<>
			<div 
				className="product__item"
				onClick={handleCardClick}
				style={{cursor: 'pointer'}}
			>
				<div className="product__item__pic set-bg" style={{
					backgroundImage: `url(${allImages[currentImageIndex]})`,
					position: 'relative'
				}}> 
					{product.onSale && product.discount && (
						<span className="label" style={{
							position: 'absolute',
							top: '10px',
							left: '10px',
							background: '#e53637',
							color: '#fff',
							padding: '5px 12px',
							fontSize: '11px',
							fontWeight: '700',
							textTransform: 'uppercase',
							letterSpacing: '2px',
							zIndex: 2
						}}>
							<i className="fa fa-bolt" style={{ marginRight: '5px' }}></i>
							SALE {product.discount.type === 'percentage' ? `-${product.discount.value}%` : `-$${product.discount.value}`}
						</span>
					)} 
					{!product.onSale && product.isFeatured && (
						<span className="label" style={{
							position: 'absolute',
							top: '10px',
							left: '10px',
							background: '#895129',
							color: '#fff',
							padding: '3px 10px',
							fontSize: '11px',
							fontWeight: '700',
							textTransform: 'uppercase',
							letterSpacing: '2px',
							zIndex: 2
						}}>
							Featured
						</span>
					)}
					{product.totalStock === 0 && (
						<span className="label" style={{
							position: 'absolute',
							top: '10px',
							right: '10px',
							background: '#6f6f6f',
							color: '#fff',
							padding: '3px 10px',
							fontSize: '11px',
							fontWeight: '700',
							textTransform: 'uppercase',
							letterSpacing: '2px',
							zIndex: 2
						}}>
							Out of Stock
						</span>
					)}
 
					{allImages.length > 1 && (
						<>
							<button
								onClick={handlePrevImage}
								style={{
									position: 'absolute',
									left: '10px',
									top: '50%',
									transform: 'translateY(-50%)',
									background: 'rgba(255, 255, 255, 0.9)',
									border: 'none',
									borderRadius: '50%',
									width: '35px',
									height: '35px',
									cursor: 'pointer',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									zIndex: 3,
									transition: 'all 0.3s',
									opacity: 0,
									pointerEvents: 'none'
								}}
								className="carousel-btn-prev"
							>
								<i className="fa fa-angle-left" style={{fontSize: '18px', color: '#111'}}></i>
							</button>

							<button
								onClick={handleNextImage}
								style={{
									position: 'absolute',
									right: '10px',
									top: '50%',
									transform: 'translateY(-50%)',
									background: 'rgba(255, 255, 255, 0.9)',
									border: 'none',
									borderRadius: '50%',
									width: '35px',
									height: '35px',
									cursor: 'pointer',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									zIndex: 3,
									transition: 'all 0.3s',
									opacity: 0,
									pointerEvents: 'none'
								}}
								className="carousel-btn-next"
							>
								<i className="fa fa-angle-right" style={{fontSize: '18px', color: '#111'}}></i>
							</button> 
							<div style={{
								position: 'absolute',
								bottom: '15px',
								left: '50%',
								transform: 'translateX(-50%)',
								display: 'flex',
								gap: '6px',
								zIndex: 2
							}}>
								{allImages.map((_, index) => (
									<div
										key={index}
										onClick={(e) => {
											e.preventDefault();
											e.stopPropagation();
											setCurrentImageIndex(index);
										}}
										style={{
											width: index === currentImageIndex ? '20px' : '8px',
											height: '8px',
											borderRadius: '4px',
											background: index === currentImageIndex ? '#fff' : 'rgba(255, 255, 255, 0.5)',
											cursor: 'pointer',
											transition: 'all 0.3s'
										}}
									/>
								))}
							</div>
						</>
					)} 
					<ul className="product__hover">
						<li>
							<a href="#" onClick={handleWishlist} title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}>
								<i className={isInWishlist ? "fa fa-heart" : "fa fa-heart-o"} style={isInWishlist ? {color: '#e53637'} : {}}></i>
							</a>
						</li> 
					</ul>
				</div>

				<div className="product__item__text">
					<h6>
						<a href="#" onClick={(e) => {
							e.preventDefault();
							handleCardClick();
						}}>
							{product.name}
						</a>
					</h6> 
					{product.onSale && product.salePrice ? (
						<div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px' }}>
							<h5 style={{ 
								color: '#e53637', 
								fontWeight: '700',
								margin: 0,
								fontSize: '22px'
							}}>
								${product.salePrice.toFixed(2)}
							</h5>
							<span style={{
								textDecoration: 'line-through',
								color: '#999',
								fontSize: '16px',
								fontWeight: '500'
							}}>
								${product.originalPrice.toFixed(2)}
							</span>
							<span style={{
								background: '#e5363715',
								color: '#e53637',
								padding: '3px 8px',
								borderRadius: '4px',
								fontSize: '11px',
								fontWeight: '700',
								letterSpacing: '0.5px'
							}}>
								SAVE ${(product.originalPrice - product.salePrice).toFixed(2)}
							</span>
						</div>
					) : (
						<h5 style={{ marginTop: '8px' }}>${product.price.toFixed(2)}</h5>
					)}
					
					<a href="#" className="add-cart" onClick={handleAddToCart}>
						+ Add To Cart
					</a>
					<div className="rating" style={{marginTop: '10px'}}>
						{[...Array(5)].map((_, index) => (
							<i 
								key={index} 
								className={index < Math.floor(product.averageRating || 0) ? "fa fa-star" : "fa fa-star-o"}
							/>
						))}
					</div> 
					{product.colors && product.colors.length > 0 && (
						<div className="product__color__select" style={{marginTop: '10px'}}>
							{product.colors.slice(0, 3).map((color, idx) => (
								<label 
									key={idx} 
									className={idx === 0 ? 'active' : ''} 
									htmlFor={`pc-${product._id}-${idx}`}
									style={{
										background: color,
										width: '15px',
										height: '15px',
										borderRadius: '50%',
										display: 'inline-block',
										marginRight: '5px',
										border: '1px solid #e5e5e5',
										cursor: 'pointer'
									}}
									onClick={(e) => e.stopPropagation()}
								>
									<input type="radio" id={`pc-${product._id}-${idx}`} style={{display: 'none'}} />
								</label>
							))}
						</div>
					)}
				</div>

				<style>{`
					.product__item:hover .carousel-btn-prev,
					.product__item:hover .carousel-btn-next {
						opacity: 1 !important;
						pointer-events: auto !important;
					}

					.carousel-btn-prev:hover,
					.carousel-btn-next:hover {
						background: rgba(229, 54, 55, 0.9) !important;
					}

					.carousel-btn-prev:hover i,
					.carousel-btn-next:hover i {
						color: #fff !important;
					}
				`}</style>
			</div>
 
			<SizeSelectionModal 
				isOpen={showSizeModal}
				onClose={() => setShowSizeModal(false)}
				product={product}
				onAddToCart={handleAddToCartWithOptions}
			/>
		</>
	);
};

export default ProductCard;