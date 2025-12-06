import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useCartStore } from "../stores/useCartStore";
import { useUserStore } from "../stores/useUserStore";
import { useWishlistStore } from "../stores/Usewishliststore";
import LoadingSpinner from "../components/LoadingSpinner";
import PeopleAlsoBought from "../components/PeopleAlsoBought";
import toast from "react-hot-toast";
import axios from "../lib/axios";

const ProductDetails = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { addToCart } = useCartStore();
	const { user } = useUserStore();
	const { toggleWishlist, checkInWishlist } = useWishlistStore();

	const [product, setProduct] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [mainImage, setMainImage] = useState("");
	const [selectedSize, setSelectedSize] = useState("");
	const [selectedColor, setSelectedColor] = useState("");
	const [quantity, setQuantity] = useState(1);
	const [isInWishlist, setIsInWishlist] = useState(false);
	
	const [activeTab, setActiveTab] = useState("description");
	const [showReviewForm, setShowReviewForm] = useState(false);
	const [reviewRating, setReviewRating] = useState(0);
	const [reviewComment, setReviewComment] = useState("");
	const [reviewImages, setReviewImages] = useState([]);
	const [hoveredRating, setHoveredRating] = useState(0);
	const [submittingReview, setSubmittingReview] = useState(false);
	
	const [editingReview, setEditingReview] = useState(null);
	const [editRating, setEditRating] = useState(0);
	const [editComment, setEditComment] = useState("");
	const [editImages, setEditImages] = useState([]);
	const [editHoveredRating, setEditHoveredRating] = useState(0);
	
	const [lightboxOpen, setLightboxOpen] = useState(false);
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	
	const [previewImage, setPreviewImage] = useState(null);

	const allImages = product?.images && product.images.length > 0 
		? product.images.filter(img => img && img.trim() !== '')
		: (product?.image ? [product.image] : []);

	const openLightbox = (index) => {
		setCurrentImageIndex(index);
		setLightboxOpen(true);
	};

	const closeLightbox = () => {
		setLightboxOpen(false);
	};

	const nextImage = () => {
		setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
	};

	const prevImage = () => {
		setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
	};

	useEffect(() => {
		const handleKeyDown = (e) => {
			if (!lightboxOpen) return;
			
			if (e.key === 'Escape') {
				closeLightbox();
			} else if (e.key === 'ArrowRight') {
				nextImage();
			} else if (e.key === 'ArrowLeft') {
				prevImage();
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [lightboxOpen, allImages.length]);

	useEffect(() => {
		let isMounted = true;

		const fetchProduct = async () => {
			try {
				setLoading(true);
				setError(null);
				
				const res = await axios.get(`/products/${id}`);
				
				if (!isMounted) return;
				
				setProduct(res.data);
				
				if (res.data.images && res.data.images.length > 0) {
					setMainImage(res.data.images[0]);
				} else if (res.data.image) {
					setMainImage(res.data.image);
				}
				
				if (res.data.variants && res.data.variants.length > 0) {
					setSelectedSize(res.data.variants[0].size);
				}
				if (res.data.colors && res.data.colors.length > 0) {
					setSelectedColor(res.data.colors[0]);
				}
				
				setLoading(false);
			} catch (error) {
				if (!isMounted) return;
				setError(error.response?.data?.message || "Product not found");
				setLoading(false);
			}
		};

		fetchProduct();

		return () => {
			isMounted = false;
		};
	}, [id]);

	useEffect(() => {
		if (user && product) {
			setIsInWishlist(checkInWishlist(product._id));
		}
	}, [user, product, checkInWishlist]);

	const handleWishlist = async () => {
		if (!user) {
			toast.error("Please login to add items to wishlist");
			navigate("/login");
			return;
		}

		const success = await toggleWishlist(product._id);
		if (success) {
			setIsInWishlist(!isInWishlist);
		}
	};

	const handleReviewImageUpload = (e, isEdit = false) => {
		const files = Array.from(e.target.files);
		const maxImages = 3;
		const currentImages = isEdit ? editImages : reviewImages;
		
		if (currentImages.length + files.length > maxImages) {
			toast.error(`Maximum ${maxImages} images allowed`);
			return;
		}

		files.forEach(file => {
			if (file.size > 5 * 1024 * 1024) {
				toast.error("Image size must be less than 5MB");
				return;
			}

			const reader = new FileReader();
			reader.onloadend = () => {
				if (isEdit) {
					setEditImages(prev => [...prev, reader.result]);
				} else {
					setReviewImages(prev => [...prev, reader.result]);
				}
			};
			reader.readAsDataURL(file);
		});
	};

	const removeReviewImage = (index, isEdit = false) => {
		if (isEdit) {
			setEditImages(prev => prev.filter((_, i) => i !== index));
		} else {
			setReviewImages(prev => prev.filter((_, i) => i !== index));
		}
	};

	const handleSubmitReview = async (e) => {
		e.preventDefault();
		
		if (!user) {
			toast.error("Please login to leave a review");
			navigate("/login");
			return;
		}

		if (reviewRating === 0) {
			toast.error("Please select a rating");
			return;
		}

		if (reviewComment.trim().length < 10) {
			toast.error("Review must be at least 10 characters");
			return;
		}

		setSubmittingReview(true);

		try {
			const res = await axios.post(`/products/${id}/reviews`, {
				rating: reviewRating,
				comment: reviewComment.trim(),
				images: reviewImages
			});

			setProduct(res.data.product);
			setReviewRating(0);
			setReviewComment("");
			setReviewImages([]);
			setShowReviewForm(false);
			
			toast.success("Review submitted successfully!");
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to submit review");
		} finally {
			setSubmittingReview(false);
		}
	};

	const startEditReview = (review) => {
		setEditingReview(review._id);
		setEditRating(review.rating);
		setEditComment(review.comment);
		setEditImages(review.images || []);
	};

	const cancelEditReview = () => {
		setEditingReview(null);
		setEditRating(0);
		setEditComment("");
		setEditImages([]);
	};

	const handleUpdateReview = async (reviewId) => {
		if (editRating === 0) {
			toast.error("Please select a rating");
			return;
		}

		if (editComment.trim().length < 10) {
			toast.error("Review must be at least 10 characters");
			return;
		}

		setSubmittingReview(true);

		try {
			const res = await axios.put(`/products/${id}/reviews/${reviewId}`, {
				rating: editRating,
				comment: editComment.trim(),
				images: editImages
			});

			setProduct(res.data.product);
			cancelEditReview();
			toast.success("Review updated successfully!");
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to update review");
		} finally {
			setSubmittingReview(false);
		}
	};

	const handleDeleteReview = async (reviewId) => {
		if (!window.confirm("Are you sure you want to delete this review?")) {
			return;
		}

		try {
			const res = await axios.delete(`/products/${id}/reviews/${reviewId}`);
			setProduct(res.data.product);
			toast.success("Review deleted successfully!");
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to delete review");
		}
	};

	const handleAddToCart = () => {
		if (!user) {
			toast.error("Please login to add items to cart");
			navigate("/login");
			return;
		}

		if (product.totalStock === 0) {
			toast.error("This product is out of stock");
			return;
		}

		if (product.variants && product.variants.length > 0 && !selectedSize) {
			toast.error("Please select a size");
			return;
		}

		addToCart(product, selectedSize, selectedColor, quantity);
	};

	const userHasReviewed = user && product?.reviews?.some(
		review => review.user?._id === user._id || review.user === user._id
	);

	if (loading) {
		return <LoadingSpinner />;
	}

	if (error || !product) {
		return (
			<div>
				<section className="breadcrumb-option">
					<div className="container">
						<div className="row">
							<div className="col-lg-12">
								<div className="breadcrumb__text">
									<h4>Product Not Found</h4>
									<div className="breadcrumb__links">
										<Link to="/">Home</Link>
										<span>Error</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				<section className="shop spad">
					<div className="container">
						<div style={{textAlign: 'center', padding: '80px 0'}}>
							<i className="fa fa-exclamation-triangle" style={{fontSize: '80px', color: '#e53637', marginBottom: '20px'}}></i>
							<h3>Product Not Found</h3>
							<p style={{color: '#6f6f6f', marginBottom: '30px'}}>
								{error || "The product you're looking for doesn't exist."}
							</p>
							<Link to="/category/all" className="primary-btn">
								Back to Shop
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
								<h4>{product.name}</h4>
								<div className="breadcrumb__links">
									<Link to="/">Home</Link>
									<Link to={`/category/${product.category}`}>{product.category}</Link>
									<span>{product.name}</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="shop-details spad">
				<div className="container">
					<div className="row">
						<div className="col-lg-6">
							<div className="product__details__pic">
								<div 
									className="product__details__pic__item"
									style={{ cursor: 'zoom-in', position: 'relative' }}
									onClick={() => openLightbox(allImages.indexOf(mainImage))}
								>
									<img 
										src={mainImage} 
										alt={product.name}
										style={{
											width: '100%',
											height: '600px',
											objectFit: 'cover',
											borderRadius: '0'
										}}
									/>
									<div style={{
										position: 'absolute',
										top: '20px',
										right: '20px',
										background: 'rgba(0,0,0,0.6)',
										color: '#fff',
										padding: '10px 15px',
										borderRadius: '4px',
										fontSize: '12px',
										fontWeight: '600',
										display: 'flex',
										alignItems: 'center',
										gap: '8px',
										pointerEvents: 'none'
									}}>
										<i className="fa fa-search-plus"></i>
										Click to zoom
									</div>
								</div>

								{allImages.length > 1 && (
									<div className="product__details__pic__slider" style={{
										display: 'flex',
										gap: '10px',
										marginTop: '20px',
										flexWrap: 'wrap'
									}}>
										{allImages.map((img, idx) => (
											<div 
												key={idx}
												onClick={() => {
													setMainImage(img);
													setCurrentImageIndex(idx);
												}}
												style={{
													width: '80px',
													height: '80px',
													cursor: 'pointer',
													border: mainImage === img ? '2px solid #e53637' : '2px solid transparent',
													borderRadius: '0',
													overflow: 'hidden',
													transition: 'all 0.3s'
												}}
												onMouseEnter={(e) => {
													if (mainImage !== img) e.currentTarget.style.opacity = '0.7';
												}}
												onMouseLeave={(e) => {
													e.currentTarget.style.opacity = '1';
												}}
											>
												<img 
													src={img} 
													alt={`${product.name} ${idx + 1}`}
													style={{
														width: '100%',
														height: '100%',
														objectFit: 'cover'
													}}
												/>
											</div>
										))}
									</div>
								)}
							</div>
						</div>

						<div className="col-lg-6">
							<div className="product__details__text">
								<span style={{
									fontSize: '12px',
									color: '#999',
									textTransform: 'uppercase',
									letterSpacing: '2px'
								}}>
									{product.category}
								</span>

								<h3 style={{
									fontSize: '28px',
									fontWeight: '700',
									color: '#111',
									margin: '10px 0 20px'
								}}>
									{product.name}
								</h3>

								<div style={{
									display: 'flex',
									alignItems: 'center',
									gap: '10px',
									marginBottom: '20px'
								}}>
									<div style={{display: 'flex', gap: '3px'}}>
										{[...Array(5)].map((_, i) => (
											<i
												key={i}
												className={i < Math.floor(product.averageRating || 0) ? "fa fa-star" : "fa fa-star-o"}
												style={{color: '#f39c12', fontSize: '14px'}}
											/>
										))}
									</div>
									<span style={{color: '#666', fontSize: '14px'}}>
										({product.reviews?.length || 0} reviews)
									</span>
								</div>

								<div style={{
									fontSize: '32px',
									fontWeight: '700',
									color: '#e53637',
									marginBottom: '20px'
								}}>
									${product.price?.toFixed(2)}
								</div>

								<p style={{
									color: '#666',
									lineHeight: '1.8',
									marginBottom: '30px'
								}}>
									{product.description}
								</p>

								{product.variants && product.variants.length > 0 && (
									<div style={{marginBottom: '25px'}}>
										<h6 style={{
											fontSize: '14px',
											fontWeight: '700',
											marginBottom: '15px',
											textTransform: 'uppercase'
										}}>
											Size
										</h6>
										<div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
											{product.variants.map((variant, idx) => (
												<button
													key={idx}
													onClick={() => setSelectedSize(variant.size)}
													disabled={variant.stock === 0}
													style={{
														padding: '10px 20px',
														border: selectedSize === variant.size ? '2px solid #111' : '1px solid #e5e5e5',
														background: variant.stock === 0 ? '#f5f5f5' : '#fff',
														color: variant.stock === 0 ? '#ccc' : '#111',
														cursor: variant.stock === 0 ? 'not-allowed' : 'pointer',
														fontWeight: selectedSize === variant.size ? '700' : '400',
														transition: 'all 0.3s',
														textDecoration: variant.stock === 0 ? 'line-through' : 'none'
													}}
												>
													{variant.size}
												</button>
											))}
										</div>
									</div>
								)}

								{product.colors && product.colors.length > 0 && (
									<div style={{marginBottom: '25px'}}>
										<h6 style={{
											fontSize: '14px',
											fontWeight: '700',
											marginBottom: '15px',
											textTransform: 'uppercase'
										}}>
											Color
										</h6>
										<div style={{display: 'flex', gap: '10px'}}>
											{product.colors.map((color, idx) => (
												<button
													key={idx}
													onClick={() => setSelectedColor(color)}
													style={{
														width: '35px',
														height: '35px',
														borderRadius: '50%',
														background: color,
														border: selectedColor === color ? '3px solid #111' : '2px solid #e5e5e5',
														cursor: 'pointer',
														transition: 'all 0.3s'
													}}
													title={color}
												/>
											))}
										</div>
									</div>
								)}

								<div style={{
									display: 'flex',
									gap: '15px',
									alignItems: 'center',
									marginBottom: '20px'
								}}>
									<div className="pro-qty" style={{
										display: 'flex',
										alignItems: 'center',
										border: '1px solid #e5e5e5',
										borderRadius: '4px',
										overflow: 'hidden'
									}}>
										<span 
											onClick={() => setQuantity(Math.max(1, quantity - 1))}
											style={{
												width: '40px',
												height: '50px',
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
												cursor: 'pointer',
												background: '#f5f5f5',
												userSelect: 'none'
											}}
										>-</span>
										<input 
											type="text" 
											value={quantity} 
											readOnly 
											style={{
												width: '60px',
												textAlign: 'center',
												border: 'none',
												outline: 'none',
												fontWeight: '600'
											}}
										/>
										<span 
											onClick={() => setQuantity(Math.min(product.totalStock, quantity + 1))}
											style={{
												width: '40px',
												height: '50px',
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
												cursor: 'pointer',
												background: '#f5f5f5',
												userSelect: 'none'
											}}
										>+</span>
									</div>

									<button
										onClick={handleAddToCart}
										className="primary-btn"
										disabled={product.totalStock === 0}
										style={{
											flex: 1,
											height: '50px',
											opacity: product.totalStock === 0 ? 0.5 : 1,
											cursor: product.totalStock === 0 ? 'not-allowed' : 'pointer'
										}}
									>
										<i className="fa fa-shopping-cart" style={{marginRight: '8px'}}></i>
										{product.totalStock === 0 ? 'Out of Stock' : 'Add to Cart'}
									</button>
								</div>

								<button
									onClick={handleWishlist}
									style={{
										width: '100%',
										height: '50px',
										background: isInWishlist ? '#e53637' : 'transparent',
										border: `2px solid ${isInWishlist ? '#e53637' : '#e5e5e5'}`,
										color: isInWishlist ? '#fff' : '#111',
										cursor: 'pointer',
										borderRadius: '4px',
										fontSize: '16px',
										fontWeight: '600',
										transition: 'all 0.3s',
										marginBottom: '20px'
									}}
								>
									<i 
										className={isInWishlist ? "fa fa-heart" : "fa fa-heart-o"}
										style={{marginRight: '8px'}}
									/>
									{isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
								</button>

								{product.tags && product.tags.length > 0 && (
									<div style={{marginTop: '30px'}}>
										<strong style={{display: 'block', marginBottom: '10px'}}>Tags:</strong>
										<div style={{display: 'flex', gap: '8px', flexWrap: 'wrap'}}>
											{product.tags.map((tag, idx) => (
												<span 
													key={idx}
													style={{
														background: '#f5f5f5',
														padding: '6px 15px',
														borderRadius: '20px',
														fontSize: '13px',
														color: '#6f6f6f'
													}}
												>
													#{tag}
												</span>
											))}
										</div>
									</div>
								)}
							</div>
						</div>
					</div>

					<div className="row" style={{marginTop: '60px'}}>
						<div className="col-lg-12">
							<div className="product__details__tab">
								<ul className="nav nav-tabs" role="tablist">
									<li className="nav-item">
										<a 
											className={`nav-link ${activeTab === 'description' ? 'active' : ''}`}
											onClick={() => setActiveTab('description')}
											style={{cursor: 'pointer'}}
										>
											Description
										</a>
									</li>
									<li className="nav-item">
										<a 
											className={`nav-link ${activeTab === 'reviews' ? 'active' : ''}`}
											onClick={() => setActiveTab('reviews')}
											style={{cursor: 'pointer'}}
										>
											Reviews ({product.reviews?.length || 0})
										</a>
									</li>
								</ul>
								<div className="tab-content">
									{activeTab === 'description' && (
										<div className="tab-pane fade show active" style={{padding: '40px 0'}}>
											<h6>Product Information</h6>
											<p>{product.description}</p>
										</div>
									)}

									{activeTab === 'reviews' && (
										<div className="tab-pane fade show active" style={{padding: '40px 0'}}>
											<div style={{
												display: 'flex',
												justifyContent: 'space-between',
												alignItems: 'center',
												marginBottom: '30px'
											}}>
												<div>
													<h5 style={{
														fontSize: '20px',
														fontWeight: '700',
														color: '#111',
														margin: 0
													}}>
														Customer Reviews
													</h5>
													{product.reviews?.length > 0 && (
														<div style={{
															display: 'flex',
															alignItems: 'center',
															gap: '10px',
															marginTop: '10px'
														}}>
															<div style={{display: 'flex', gap: '3px'}}>
																{[...Array(5)].map((_, i) => (
																	<i
																		key={i}
																		className={i < Math.floor(product.averageRating || 0) ? "fa fa-star" : "fa fa-star-o"}
																		style={{color: '#f39c12', fontSize: '16px'}}
																	/>
																))}
															</div>
															<span style={{color: '#111', fontWeight: '600'}}>
																{product.averageRating?.toFixed(1)} out of 5
															</span>
															<span style={{color: '#666'}}>
																({product.reviews?.length} reviews)
															</span>
														</div>
													)}
												</div>

												{user && !userHasReviewed && !showReviewForm && (
													<button
														onClick={() => setShowReviewForm(true)}
														style={{
															display: 'flex',
															alignItems: 'center',
															gap: '8px',
															padding: '12px 24px',
															background: '#111',
															color: '#fff',
															border: 'none',
															borderRadius: '4px',
															fontSize: '14px',
															fontWeight: '600',
															cursor: 'pointer',
															transition: 'all 0.3s'
														}}
														onMouseEnter={(e) => e.target.style.background = '#333'}
														onMouseLeave={(e) => e.target.style.background = '#111'}
													>
														<i className="fa fa-pencil"></i>
														Write a Review
													</button>
												)}

												{!user && (
													<Link
														to="/login"
														style={{
															display: 'flex',
															alignItems: 'center',
															gap: '8px',
															padding: '12px 24px',
															background: '#f5f5f5',
															color: '#111',
															border: 'none',
															borderRadius: '4px',
															fontSize: '14px',
															fontWeight: '600',
															textDecoration: 'none',
															transition: 'all 0.3s'
														}}
													>
														<i className="fa fa-sign-in"></i>
														Login to Review
													</Link>
												)}
											</div>

											{showReviewForm && (
												<div style={{
													background: '#fff',
													border: '1px solid #e5e5e5',
													borderRadius: '8px',
													padding: '30px',
													marginBottom: '40px'
												}}>
													<div style={{
														display: 'flex',
														justifyContent: 'space-between',
														alignItems: 'center',
														marginBottom: '25px'
													}}>
														<h6 style={{
															fontSize: '18px',
															fontWeight: '700',
															color: '#111',
															margin: 0
														}}>
															Write Your Review
														</h6>
														<button
															onClick={() => {
																setShowReviewForm(false);
																setReviewRating(0);
																setReviewComment("");
																setReviewImages([]);
															}}
															style={{
																background: 'none',
																border: 'none',
																fontSize: '24px',
																color: '#999',
																cursor: 'pointer'
															}}
														>
															×
														</button>
													</div>

													<form onSubmit={handleSubmitReview}>
														<div style={{marginBottom: '25px'}}>
															<label style={{
																display: 'block',
																marginBottom: '10px',
																fontWeight: '600',
																color: '#111',
																fontSize: '14px'
															}}>
																<i className="fa fa-star" style={{marginRight: '8px', color: '#f39c12'}}></i>
																Rating
															</label>
															<div style={{display: 'flex', gap: '8px', fontSize: '32px'}}>
																{[1, 2, 3, 4, 5].map((star) => (
																	<i
																		key={star}
																		className={star <= (hoveredRating || reviewRating) ? "fa fa-star" : "fa fa-star-o"}
																		style={{
																			color: star <= (hoveredRating || reviewRating) ? '#f39c12' : '#ddd',
																			cursor: 'pointer',
																			transition: 'all 0.2s'
																		}}
																		onClick={() => setReviewRating(star)}
																		onMouseEnter={() => setHoveredRating(star)}
																		onMouseLeave={() => setHoveredRating(0)}
																	/>
																))}
															</div>
														</div>

														<div style={{marginBottom: '25px'}}>
															<label style={{
																display: 'block',
																marginBottom: '10px',
																fontWeight: '600',
																color: '#111',
																fontSize: '14px'
															}}>
																<i className="fa fa-comment" style={{marginRight: '8px', color: '#666'}}></i>
																Your Review
															</label>
															<textarea
																value={reviewComment}
																onChange={(e) => setReviewComment(e.target.value)}
																placeholder="Share your experience with this product... (minimum 10 characters)"
																style={{
																	width: '100%',
																	minHeight: '120px',
																	padding: '15px',
																	border: '1px solid #e5e5e5',
																	borderRadius: '4px',
																	resize: 'vertical',
																	fontSize: '14px',
																	outline: 'none',
																	transition: 'border-color 0.3s'
																}}
																onFocus={(e) => e.target.style.borderColor = '#111'}
																onBlur={(e) => e.target.style.borderColor = '#e5e5e5'}
															/>
														</div>

														<div style={{marginBottom: '25px'}}>
															<label style={{
																display: 'block',
																marginBottom: '10px',
																fontWeight: '600',
																color: '#111',
																fontSize: '14px'
															}}>
																<i className="fa fa-camera" style={{marginRight: '8px', color: '#666'}}></i>
																Add Photos (Optional - Max 3)
															</label>
															
															<div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
																{reviewImages.map((img, idx) => (
																	<div key={idx} style={{
																		position: 'relative',
																		width: '80px',
																		height: '80px'
																	}}>
																		<img 
																			src={img} 
																			alt={`Review ${idx + 1}`}
																			style={{
																				width: '100%',
																				height: '100%',
																				objectFit: 'cover',
																				borderRadius: '4px',
																				border: '1px solid #e5e5e5'
																			}}
																		/>
																		<button
																			type="button"
																			onClick={() => removeReviewImage(idx)}
																			style={{
																				position: 'absolute',
																				top: '-8px',
																				right: '-8px',
																				width: '20px',
																				height: '20px',
																				borderRadius: '50%',
																				background: '#e53637',
																				color: '#fff',
																				border: 'none',
																				fontSize: '12px',
																				cursor: 'pointer',
																				display: 'flex',
																				alignItems: 'center',
																				justifyContent: 'center'
																			}}
																		>
																			×
																		</button>
																	</div>
																))}

																{reviewImages.length < 3 && (
																	<label style={{
																		width: '80px',
																		height: '80px',
																		border: '2px dashed #ddd',
																		borderRadius: '4px',
																		display: 'flex',
																		flexDirection: 'column',
																		alignItems: 'center',
																		justifyContent: 'center',
																		cursor: 'pointer',
																		transition: 'all 0.3s',
																		background: '#fafafa'
																	}}
																	onMouseEnter={(e) => e.currentTarget.style.borderColor = '#111'}
																	onMouseLeave={(e) => e.currentTarget.style.borderColor = '#ddd'}
																	>
																		<i className="fa fa-plus" style={{fontSize: '20px', color: '#999'}}></i>
																		<input
																			type="file"
																			accept="image/*"
																			multiple
																			onChange={(e) => handleReviewImageUpload(e, false)}
																			style={{display: 'none'}}
																		/>
																	</label>
																)}
															</div>
														</div>

														<button 
															type="submit" 
															disabled={submittingReview}
															style={{
																padding: '14px 30px',
																background: submittingReview ? '#ccc' : '#e53637',
																color: '#fff',
																border: 'none',
																borderRadius: '4px',
																fontSize: '14px',
																fontWeight: '700',
																cursor: submittingReview ? 'not-allowed' : 'pointer',
																transition: 'all 0.3s'
															}}
															onMouseEnter={(e) => {
																if (!submittingReview) e.target.style.background = '#c92a2a';
															}}
															onMouseLeave={(e) => {
																if (!submittingReview) e.target.style.background = '#e53637';
															}}
														>
															{submittingReview ? (
																<>
																	<i className="fa fa-spinner fa-spin" style={{marginRight: '8px'}}></i>
																	Submitting...
																</>
															) : (
																<>
																	<i className="fa fa-check" style={{marginRight: '8px'}}></i>
																	Submit Review
																</>
															)}
														</button>
													</form>
												</div>
											)}

											<div>
												{product.reviews && product.reviews.length > 0 ? (
													product.reviews.map((review) => (
														<div 
															key={review._id}
															style={{
																background: '#fff',
																border: '1px solid #f0f0f0',
																borderRadius: '8px',
																padding: '25px',
																marginBottom: '20px'
															}}
														>
															{editingReview === review._id ? (
																<div>
																	<div style={{
																		display: 'flex',
																		justifyContent: 'space-between',
																		alignItems: 'center',
																		marginBottom: '20px'
																	}}>
																		<h6 style={{margin: 0, color: '#111', fontWeight: '600'}}>
																			Edit Your Review
																		</h6>
																		<button
																			onClick={cancelEditReview}
																			style={{
																				background: 'none',
																				border: 'none',
																				color: '#999',
																				cursor: 'pointer',
																				fontSize: '14px'
																			}}
																		>
																			Cancel
																		</button>
																	</div>

																	<div style={{marginBottom: '20px'}}>
																		<div style={{display: 'flex', gap: '8px', fontSize: '28px'}}>
																			{[1, 2, 3, 4, 5].map((star) => (
																				<i
																					key={star}
																					className={star <= (editHoveredRating || editRating) ? "fa fa-star" : "fa fa-star-o"}
																					style={{
																						color: star <= (editHoveredRating || editRating) ? '#f39c12' : '#ddd',
																						cursor: 'pointer'
																					}}
																					onClick={() => setEditRating(star)}
																					onMouseEnter={() => setEditHoveredRating(star)}
																					onMouseLeave={() => setEditHoveredRating(0)}
																				/>
																			))}
																		</div>
																	</div>

																	<div style={{marginBottom: '20px'}}>
																		<textarea
																			value={editComment}
																			onChange={(e) => setEditComment(e.target.value)}
																			style={{
																				width: '100%',
																				minHeight: '100px',
																				padding: '15px',
																				border: '1px solid #e5e5e5',
																				borderRadius: '4px',
																				resize: 'vertical',
																				fontSize: '14px'
																			}}
																		/>
																	</div>

																	<div style={{marginBottom: '20px'}}>
																		<div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
																			{editImages.map((img, idx) => (
																				<div key={idx} style={{
																					position: 'relative',
																					width: '60px',
																					height: '60px'
																				}}>
																					<img 
																						src={img} 
																						alt={`Edit ${idx + 1}`}
																						style={{
																							width: '100%',
																							height: '100%',
																							objectFit: 'cover',
																							borderRadius: '4px'
																						}}
																					/>
																					<button
																						type="button"
																						onClick={() => removeReviewImage(idx, true)}
																						style={{
																							position: 'absolute',
																							top: '-6px',
																							right: '-6px',
																							width: '18px',
																							height: '18px',
																							borderRadius: '50%',
																							background: '#e53637',
																							color: '#fff',
																							border: 'none',
																							fontSize: '10px',
																							cursor: 'pointer'
																						}}
																					>
																						×
																					</button>
																				</div>
																			))}

																			{editImages.length < 3 && (
																				<label style={{
																					width: '60px',
																					height: '60px',
																					border: '2px dashed #ddd',
																					borderRadius: '4px',
																					display: 'flex',
																					alignItems: 'center',
																					justifyContent: 'center',
																					cursor: 'pointer'
																				}}>
																					<i className="fa fa-plus" style={{color: '#999'}}></i>
																					<input
																						type="file"
																						accept="image/*"
																						multiple
																						onChange={(e) => handleReviewImageUpload(e, true)}
																						style={{display: 'none'}}
																					/>
																				</label>
																			)}
																		</div>
																	</div>

																	<button
																		onClick={() => handleUpdateReview(review._id)}
																		disabled={submittingReview}
																		style={{
																			padding: '10px 20px',
																			background: '#10b981',
																			color: '#fff',
																			border: 'none',
																			borderRadius: '4px',
																			fontWeight: '600',
																			cursor: 'pointer'
																		}}
																	>
																		{submittingReview ? 'Saving...' : 'Save Changes'}
																	</button>
																</div>
															) : (
																<>
																	<div style={{
																		display: 'flex',
																		gap: '15px'
																	}}>
																		<div style={{
																			width: '50px',
																			height: '50px',
																			borderRadius: '50%',
																			background: '#f0f0f0',
																			display: 'flex',
																			alignItems: 'center',
																			justifyContent: 'center',
																			flexShrink: 0
																		}}>
																			<i className="fa fa-user" style={{
																				fontSize: '20px',
																				color: '#999'
																			}}></i>
																		</div>

																		<div style={{flex: 1}}>
																			<div style={{
																				display: 'flex',
																				justifyContent: 'space-between',
																				alignItems: 'flex-start',
																				marginBottom: '10px'
																			}}>
																				<div>
																					<h6 style={{
																						margin: '0 0 5px 0',
																						fontSize: '16px',
																						fontWeight: '700',
																						color: '#111'
																					}}>
																						{review.user?.name || 'Anonymous'}
																					</h6>
																					<div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
																						<div style={{display: 'flex', gap: '2px'}}>
																							{[...Array(5)].map((_, i) => (
																								<i
																									key={i}
																									className={i < review.rating ? "fa fa-star" : "fa fa-star-o"}
																									style={{color: '#f39c12', fontSize: '12px'}}
																								/>
																							))}
																						</div>
																						<span style={{
																							fontSize: '12px',
																							color: '#999'
																						}}>
																							{new Date(review.createdAt).toLocaleDateString('en-US', {
																								year: 'numeric',
																								month: 'long',
																								day: 'numeric'
																							})}
																						</span>
																						{review.updatedAt && review.updatedAt !== review.createdAt && (
																							<span style={{
																								fontSize: '11px',
																								color: '#999',
																								fontStyle: 'italic'
																							}}>
																								(edited)
																							</span>
																						)}
																					</div>
																				</div>

																				{user && (user._id === review.user?._id || user._id === review.user || user.role === 'admin') && (
																					<div style={{display: 'flex', gap: '10px'}}>
																						{(user._id === review.user?._id || user._id === review.user) && (
																							<button
																								onClick={() => startEditReview(review)}
																								style={{
																									background: 'none',
																									border: 'none',
																									color: '#666',
																									cursor: 'pointer',
																									padding: '5px',
																									fontSize: '14px'
																								}}
																								title="Edit review"
																							>
																								<i className="fa fa-pencil"></i>
																							</button>
																						)}
																						<button
																							onClick={() => handleDeleteReview(review._id)}
																							style={{
																								background: 'none',
																								border: 'none',
																								color: '#e53637',
																								cursor: 'pointer',
																								padding: '5px',
																								fontSize: '14px'
																							}}
																							title="Delete review"
																						>
																							<i className="fa fa-trash"></i>
																						</button>
																					</div>
																				)}
																			</div>

																			<p style={{
																				color: '#555',
																				lineHeight: '1.7',
																				margin: '0 0 15px 0',
																				fontSize: '14px'
																			}}>
																				{review.comment}
																			</p>

																			{review.images && review.images.length > 0 && (
																				<div style={{
																					display: 'flex',
																					gap: '10px',
																					flexWrap: 'wrap'
																				}}>
																					{review.images.map((img, idx) => (
																						<img
																							key={idx}
																							src={img}
																							alt={`Review image ${idx + 1}`}
																							style={{
																								width: '80px',
																								height: '80px',
																								objectFit: 'cover',
																								borderRadius: '4px',
																								cursor: 'pointer',
																								border: '1px solid #e5e5e5'
																							}}
																							onClick={() => setPreviewImage(img)}
																						/>
																					))}
																				</div>
																			)}
																		</div>
																	</div>
																</>
															)}
														</div>
													))
												) : (
													<div style={{
														textAlign: 'center',
														padding: '60px 20px',
														background: '#f9f9f9',
														borderRadius: '8px'
													}}>
														<i className="fa fa-comments-o" style={{
															fontSize: '60px',
															color: '#ddd',
															marginBottom: '20px',
															display: 'block'
														}}></i>
														<h6 style={{color: '#666', marginBottom: '10px'}}>
															No reviews yet
														</h6>
														<p style={{color: '#999', fontSize: '14px'}}>
															Be the first to review this product!
														</p>
													</div>
												)}
											</div>
										</div>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{lightboxOpen && allImages.length > 0 && (
				<div
					style={{
						position: 'fixed',
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						background: 'rgba(0, 0, 0, 0.95)',
						zIndex: 99999,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
						padding: '20px'
					}}
					onClick={closeLightbox}
				>
					<button
						onClick={(e) => {
							e.stopPropagation();
							closeLightbox();
						}}
						style={{
							position: 'absolute',
							top: '20px',
							right: '20px',
							width: '50px',
							height: '50px',
							background: 'rgba(255,255,255,0.1)',
							border: '2px solid rgba(255,255,255,0.3)',
							borderRadius: '0',
							color: '#fff',
							fontSize: '30px',
							cursor: 'pointer',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							transition: 'all 0.3s',
							zIndex: 100001
						}}
						onMouseEnter={(e) => {
							e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
							e.currentTarget.style.transform = 'rotate(90deg)';
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
							e.currentTarget.style.transform = 'rotate(0deg)';
						}}
					>
						×
					</button>

					<div style={{
						flex: 1,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						width: '100%',
						maxHeight: 'calc(100vh - 180px)',
						position: 'relative'
					}}>
						{allImages.length > 1 && (
							<button
								onClick={(e) => {
									e.stopPropagation();
									prevImage();
								}}
								style={{
									position: 'absolute',
									left: '20px',
									top: '50%',
									transform: 'translateY(-50%)',
									width: '50px',
									height: '50px',
									background: 'rgba(255,255,255,0.1)',
									border: '2px solid rgba(255,255,255,0.3)',
									borderRadius: '0',
									color: '#fff',
									fontSize: '24px',
									cursor: 'pointer',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									transition: 'all 0.3s',
									zIndex: 100001
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
									e.currentTarget.style.transform = 'translateY(-50%) translateX(-5px)';
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
									e.currentTarget.style.transform = 'translateY(-50%) translateX(0)';
								}}
							>
								<i className="fa fa-chevron-left"></i>
							</button>
						)}

						<img
							src={allImages[currentImageIndex]}
							alt={`${product.name} ${currentImageIndex + 1}`}
							style={{
								maxWidth: '90%',
								maxHeight: '100%',
								objectFit: 'contain',
								userSelect: 'none'
							}}
							onClick={(e) => e.stopPropagation()}
							draggable={false}
						/>

						{allImages.length > 1 && (
							<button
								onClick={(e) => {
									e.stopPropagation();
									nextImage();
								}}
								style={{
									position: 'absolute',
									right: '20px',
									top: '50%',
									transform: 'translateY(-50%)',
									width: '50px',
									height: '50px',
									background: 'rgba(255,255,255,0.1)',
									border: '2px solid rgba(255,255,255,0.3)',
									borderRadius: '0',
									color: '#fff',
									fontSize: '24px',
									cursor: 'pointer',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									transition: 'all 0.3s',
									zIndex: 100001
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
									e.currentTarget.style.transform = 'translateY(-50%) translateX(5px)';
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
									e.currentTarget.style.transform = 'translateY(-50%) translateX(0)';
								}}
							>
								<i className="fa fa-chevron-right"></i>
							</button>
						)}

						<div style={{
							position: 'absolute',
							bottom: '20px',
							left: '50%',
							transform: 'translateX(-50%)',
							background: 'rgba(0,0,0,0.7)',
							color: '#fff',
							padding: '8px 16px',
							borderRadius: '20px',
							fontSize: '14px',
							fontWeight: '600',
							pointerEvents: 'none'
						}}>
							{currentImageIndex + 1} / {allImages.length}
						</div>
					</div>

					{allImages.length > 1 && (
						<div style={{
							display: 'flex',
							gap: '10px',
							justifyContent: 'center',
							padding: '20px 0',
							maxWidth: '100%',
							overflowX: 'auto',
							flexWrap: 'wrap'
						}}
						onClick={(e) => e.stopPropagation()}
						>
							{allImages.map((img, idx) => (
								<div
									key={idx}
									onClick={(e) => {
										e.stopPropagation();
										setCurrentImageIndex(idx);
									}}
									style={{
										width: '80px',
										height: '80px',
										cursor: 'pointer',
										border: currentImageIndex === idx ? '3px solid #e53637' : '2px solid rgba(255,255,255,0.3)',
										borderRadius: '0',
										overflow: 'hidden',
										opacity: currentImageIndex === idx ? 1 : 0.6,
										transition: 'all 0.3s',
										flexShrink: 0
									}}
									onMouseEnter={(e) => {
										if (currentImageIndex !== idx) e.currentTarget.style.opacity = '0.8';
									}}
									onMouseLeave={(e) => {
										if (currentImageIndex !== idx) e.currentTarget.style.opacity = '0.6';
									}}
								>
									<img
										src={img}
										alt={`Thumbnail ${idx + 1}`}
										style={{
											width: '100%',
											height: '100%',
											objectFit: 'cover'
										}}
									/>
								</div>
							))}
						</div>
					)}

					<div style={{
						position: 'absolute',
						bottom: '120px',
						right: '20px',
						background: 'rgba(0,0,0,0.7)',
						color: '#fff',
						padding: '10px 15px',
						borderRadius: '4px',
						fontSize: '12px',
						display: 'flex',
						gap: '15px',
						pointerEvents: 'none'
					}}>
						<span><kbd style={{background: '#333', padding: '3px 8px', borderRadius: '3px'}}>←</kbd> <kbd style={{background: '#333', padding: '3px 8px', borderRadius: '3px'}}>→</kbd> Navigate</span>
						<span><kbd style={{background: '#333', padding: '3px 8px', borderRadius: '3px'}}>ESC</kbd> Close</span>
					</div>
				</div>
			)}

			{previewImage && (
				<div
					onClick={() => setPreviewImage(null)}
					style={{
						position: 'fixed',
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						background: 'rgba(0, 0, 0, 0.9)',
						zIndex: 9999,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						padding: '20px',
						cursor: 'zoom-out'
					}}
				>
					<button
						onClick={() => setPreviewImage(null)}
						style={{
							position: 'absolute',
							top: '20px',
							right: '20px',
							background: 'none',
							border: 'none',
							color: '#fff',
							fontSize: '30px',
							cursor: 'pointer'
						}}
					>
						×
					</button>
					<img
						src={previewImage}
						alt="Preview"
						style={{
							maxWidth: '90%',
							maxHeight: '90%',
							objectFit: 'contain'
						}}
						onClick={(e) => e.stopPropagation()}
					/>
				</div>
			)}
			
			<PeopleAlsoBought 
				currentProductId={product._id}
				category={product.category}
			/>
		</div>
	);
};

export default ProductDetails;