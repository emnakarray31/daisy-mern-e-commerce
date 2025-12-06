import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";
import { useWishlistStore } from "../stores/Usewishliststore";
import SizeSelectionModal from "../components/SizeSelectionModal";
import toast from "react-hot-toast";

const WishlistPage = () => {
	const navigate = useNavigate();
	const { user } = useUserStore();
	const { addToCart } = useCartStore();
	const { wishlist, loading, error, getWishlist, removeFromWishlist } = useWishlistStore();
	
 	const [showSizeModal, setShowSizeModal] = useState(false);
	const [selectedProduct, setSelectedProduct] = useState(null);

 	useEffect(() => {
		if (user) {
			getWishlist();
		}
	}, [user, getWishlist]);

 	const handleAddToCart = (product) => {
		 
		const hasVariants = product.variants && product.variants.length > 0;
		
		if (hasVariants) {
			 
			setSelectedProduct(product);
			setShowSizeModal(true);
		} else {
			 
			addToCart(product);
			toast.success("Added to cart!");
		}
	};

	 
	const handleAddToCartWithOptions = (productWithOptions) => {
		addToCart(productWithOptions);
		toast.success("Added to cart!");
		setShowSizeModal(false);
		setSelectedProduct(null);
	};
 
	const handleRemoveFromWishlist = async (productId) => {
		await removeFromWishlist(productId);
	};

	 
	const handleMoveToCart = async (product) => {
		const hasVariants = product.variants && product.variants.length > 0;
		
		if (hasVariants) {
			setSelectedProduct(product);
			setShowSizeModal(true);
		} else {
			addToCart(product);
			await removeFromWishlist(product._id);
			toast.success("Moved to cart!");
		}
	};

 
	if (!user) {
		return (
			<div>
				<section className="breadcrumb-option">
					<div className="container">
						<div className="row">
							<div className="col-lg-12">
								<div className="breadcrumb__text">
									<h4>Wishlist</h4>
									<div className="breadcrumb__links">
										<Link to="/">Home</Link>
										<span>Wishlist</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				<section className="shop spad">
					<div className="container">
						<div style={{textAlign: 'center', padding: '80px 0'}}>
							<i className="fa fa-lock" style={{fontSize: '80px', color: '#e5e5e5', marginBottom: '20px', display: 'block'}}></i>
							<h3>Please login to view your wishlist</h3>
							<p style={{color: '#6f6f6f', marginBottom: '30px'}}>
								Sign in to see your saved items
							</p>
							<Link to="/login" className="primary-btn">Login</Link>
						</div>
					</div>
				</section>
			</div>
		);
	}

	// Loading
	if (loading) {
		return (
			<div>
				<section className="breadcrumb-option">
					<div className="container">
						<div className="row">
							<div className="col-lg-12">
								<div className="breadcrumb__text">
									<h4>Wishlist</h4>
									<div className="breadcrumb__links">
										<Link to="/">Home</Link>
										<span>Wishlist</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				<section className="shop spad">
					<div className="container">
						<div style={{textAlign: 'center', padding: '80px 0'}}>
							<i className="fa fa-spinner fa-spin" style={{fontSize: '48px', color: '#e53637', marginBottom: '20px', display: 'block'}}></i>
							<h3>Loading your wishlist...</h3>
						</div>
					</div>
				</section>
			</div>
		);
	}

	 
	if (error) {
		return (
			<div>
				<section className="breadcrumb-option">
					<div className="container">
						<div className="row">
							<div className="col-lg-12">
								<div className="breadcrumb__text">
									<h4>Wishlist</h4>
									<div className="breadcrumb__links">
										<Link to="/">Home</Link>
										<span>Wishlist</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				<section className="shop spad">
					<div className="container">
						<div style={{textAlign: 'center', padding: '80px 0'}}>
							<i className="fa fa-exclamation-triangle" style={{fontSize: '80px', color: '#e53637', marginBottom: '20px', display: 'block'}}></i>
							<h3>Error loading wishlist</h3>
							<p style={{color: '#6f6f6f', marginBottom: '30px'}}>{error}</p>
							<button 
								onClick={() => getWishlist()} 
								className="primary-btn"
							>
								Retry
							</button>
						</div>
					</div>
				</section>
			</div>
		);
	}

	 
	if (!wishlist || wishlist.length === 0) {
		return (
			<div>
				<section className="breadcrumb-option">
					<div className="container">
						<div className="row">
							<div className="col-lg-12">
								<div className="breadcrumb__text">
									<h4>Wishlist</h4>
									<div className="breadcrumb__links">
										<Link to="/">Home</Link>
										<span>Wishlist</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				<section className="shop spad">
					<div className="container">
						<div style={{textAlign: 'center', padding: '80px 0'}}>
							<i className="fa fa-heart-o" style={{fontSize: '80px', color: '#e5e5e5', marginBottom: '20px', display: 'block'}}></i>
							<h3>Your wishlist is empty</h3>
							<p style={{color: '#6f6f6f', marginBottom: '30px'}}>
								Save your favorite items here to buy them later.
							</p>
							<Link to="/category/all" className="primary-btn">
								Start Shopping
							</Link>
						</div>
					</div>
				</section>
			</div>
		);
	}
	return (
		<div>
			<section className="breadcrumb-option">
				<div className="container">
					<div className="row">
						<div className="col-lg-12">
							<div className="breadcrumb__text">
								<h4>My Wishlist ({wishlist.length} {wishlist.length === 1 ? 'item' : 'items'})</h4>
								<div className="breadcrumb__links">
									<Link to="/">Home</Link>
									<span>Wishlist</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="shop spad">
				<div className="container">
					<div className="row">
						{wishlist.map((product) => (
							<div key={product._id} className="col-lg-3 col-md-4 col-sm-6" style={{marginBottom: '30px'}}>
								<div style={{
									background: '#fff',
									border: '1px solid #e5e5e5',
									borderRadius: '8px',
									overflow: 'hidden',
									transition: 'all 0.3s',
									position: 'relative'
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
									e.currentTarget.style.transform = 'translateY(-5px)';
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.boxShadow = 'none';
									e.currentTarget.style.transform = 'translateY(0)';
								}}
								>
									<button
										onClick={() => handleRemoveFromWishlist(product._id)}
										style={{
											position: 'absolute',
											top: '10px',
											right: '10px',
											background: 'rgba(255, 255, 255, 0.9)',
											border: 'none',
											borderRadius: '50%',
											width: '35px',
											height: '35px',
											cursor: 'pointer',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											zIndex: 2,
											transition: 'all 0.3s',
											boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
										}}
										onMouseEnter={(e) => {
											e.currentTarget.style.background = '#e53637';
											e.currentTarget.querySelector('i').style.color = '#fff';
										}}
										onMouseLeave={(e) => {
											e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
											e.currentTarget.querySelector('i').style.color = '#e53637';
										}}
										title="Remove from wishlist"
									>
										<i className="fa fa-times" style={{color: '#e53637', fontSize: '14px'}}></i>
									</button>

 									<Link to={`/product/${product._id}`}>
										<div style={{
											height: '250px',
											overflow: 'hidden',
											background: '#f5f5f5'
										}}>
											<img 
												src={product.image} 
												alt={product.name}
												style={{
													width: '100%',
													height: '100%',
													objectFit: 'cover',
													transition: 'transform 0.3s'
												}}
												onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
												onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
											/>
										</div>
									</Link>
									
 									<div style={{padding: '15px'}}>
 										<span style={{
											fontSize: '11px',
											color: '#999',
											textTransform: 'uppercase',
											letterSpacing: '1px'
										}}>
											{product.category}
										</span>

 										<h6 style={{
											margin: '8px 0',
											fontSize: '15px',
											fontWeight: '600'
										}}>
											<Link 
												to={`/product/${product._id}`}
												style={{
													color: '#111',
													textDecoration: 'none',
													transition: 'color 0.3s'
												}}
												onMouseEnter={(e) => e.currentTarget.style.color = '#e53637'}
												onMouseLeave={(e) => e.currentTarget.style.color = '#111'}
											>
												{product.name}
											</Link>
										</h6>
										<div style={{
											fontSize: '18px',
											fontWeight: '700',
											color: '#e53637',
											marginBottom: '15px'
										}}>
											${product.price?.toFixed(2) || '0.00'}
										</div>
										{product.totalStock !== undefined && (
											<div style={{
												fontSize: '12px',
												marginBottom: '15px',
												color: product.totalStock > 0 ? '#10b981' : '#ef4444'
											}}>
												<i className={`fa ${product.totalStock > 0 ? 'fa-check-circle' : 'fa-times-circle'}`} style={{marginRight: '5px'}}></i>
												{product.totalStock > 0 ? 'In Stock' : 'Out of Stock'}
											</div>
										)}
										{product.variants && product.variants.length > 0 && (
											<div style={{
												fontSize: '12px',
												color: '#666',
												marginBottom: '15px'
											}}>
												<span style={{fontWeight: '600'}}>Sizes: </span>
												{[...new Set(product.variants.filter(v => v.stock > 0).map(v => v.size))].join(', ') || 'None available'}
											</div>
										)}
										<div style={{display: 'flex', gap: '10px'}}>
											<button 
												onClick={() => handleAddToCart(product)}
												disabled={product.totalStock === 0}
												style={{
													flex: 1,
													padding: '12px 15px',
													background: product.totalStock === 0 ? '#ccc' : '#e53637',
													color: '#fff',
													border: 'none',
													borderRadius: '4px',
													fontSize: '13px',
													fontWeight: '700',
													cursor: product.totalStock === 0 ? 'not-allowed' : 'pointer',
													transition: 'all 0.3s',
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center',
													gap: '8px'
												}}
												onMouseEnter={(e) => {
													if (product.totalStock > 0) {
														e.currentTarget.style.background = '#ca2829';
													}
												}}
												onMouseLeave={(e) => {
													if (product.totalStock > 0) {
														e.currentTarget.style.background = '#e53637';
													}
												}}
											>
												<i className="fa fa-shopping-cart"></i>
												{product.totalStock === 0 ? 'Out of Stock' : 'Add to Cart'}
											</button>

											<button
												onClick={() => navigate(`/product/${product._id}`)}
												style={{
													padding: '12px 15px',
													background: '#f5f5f5',
													color: '#111',
													border: 'none',
													borderRadius: '4px',
													cursor: 'pointer',
													transition: 'all 0.3s'
												}}
												onMouseEnter={(e) => e.currentTarget.style.background = '#e5e5e5'}
												onMouseLeave={(e) => e.currentTarget.style.background = '#f5f5f5'}
												title="View Details"
											>
												<i className="fa fa-eye"></i>
											</button>
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
					<div style={{textAlign: 'center', marginTop: '40px'}}>
						<Link 
							to="/category/all"
							style={{
								display: 'inline-flex',
								alignItems: 'center',
								gap: '10px',
								color: '#111',
								fontSize: '14px',
								fontWeight: '600',
								textDecoration: 'none',
								padding: '12px 25px',
								border: '2px solid #111',
								transition: 'all 0.3s'
							}}
							onMouseEnter={(e) => {
								e.currentTarget.style.background = '#111';
								e.currentTarget.style.color = '#fff';
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.background = 'transparent';
								e.currentTarget.style.color = '#111';
							}}
						>
							<i className="fa fa-arrow-left"></i>
							Continue Shopping
						</Link>
					</div>
				</div>
			</section>
			{selectedProduct && (
				<SizeSelectionModal 
					isOpen={showSizeModal}
					onClose={() => {
						setShowSizeModal(false);
						setSelectedProduct(null);
					}}
					product={selectedProduct}
					onAddToCart={handleAddToCartWithOptions}
				/>
			)}
		</div>
	);
};

export default WishlistPage;