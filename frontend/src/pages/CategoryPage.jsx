import { useEffect, useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { useProductStore } from "../stores/useProductStore";
import ProductCard from "../components/ProductCard";
import LoadingSpinner from "../components/LoadingSpinner";
import axios from '../lib/axios';

const CategoryPage = () => {
	const { category } = useParams();
	const [searchParams, setSearchParams] = useSearchParams();
	const searchQuery = searchParams.get('search') || '';
	const { fetchProductsByCategory, fetchAllProducts, products } = useProductStore();
	const [sortBy, setSortBy] = useState(searchParams.get('sort') || "default");
	const [priceFilter, setPriceFilter] = useState(searchParams.get('price') || "all");
	const [sizeFilter, setSizeFilter] = useState(searchParams.get('size') || "all");
	const [colorFilter, setColorFilter] = useState(searchParams.get('color') || "all");
	const [ratingFilter, setRatingFilter] = useState(searchParams.get('rating') || "all");
	const [stockFilter, setStockFilter] = useState(searchParams.get('stock') || "all");
	const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 1);
	const [viewMode, setViewMode] = useState(searchParams.get('view') || "grid");  

	const [isLoading, setIsLoading] = useState(true);


	
	const [mergedProducts, setMergedProducts] = useState([]);
	
	const productsPerPage = 12;

	 

    useEffect(() => {
		const fetchAndMergeProducts = async () => {
			setIsLoading(true);
			try {
				if (category === "all") {
					await fetchAllProducts();
				} else {
					await fetchProductsByCategory(category);
				}
			} catch (error) {
				console.error('Error fetching products:', error);
				setIsLoading(false);
			}
		};
		fetchAndMergeProducts();
	}, [category]);
	useEffect(() => {
		const mergeWithSales = async () => {
			if (products.length === 0) {
				setMergedProducts([]);
				setIsLoading(false);
				return;
			}

			try { 
				const salesRes = await axios.get('/sales/products');
				const saleProductsMap = new Map(
					salesRes.data.map(p => [p._id, p])
				);
				const merged = products.map(product => {
					const saleVersion = saleProductsMap.get(product._id);
					return saleVersion || product;
				});

				setMergedProducts(merged);
			} catch (error) {
				console.error('Error fetching sales:', error);
				setMergedProducts(products);
			} finally {
				setIsLoading(false);
			}
		};

		mergeWithSales();
	}, [products]);
 
	const updateURL = (updates) => {
		const newParams = new URLSearchParams(searchParams);
		Object.entries(updates).forEach(([key, value]) => {
			if (value && value !== 'all' && value !== 'default') {
				newParams.set(key, value);
			} else {
				newParams.delete(key);
			}
		});
		setSearchParams(newParams);
	};
 
	const handleSortChange = (value) => {
		setSortBy(value);
		setCurrentPage(1);
		updateURL({ sort: value, page: 1 });
	};

	const handlePriceFilter = (range) => {
		setPriceFilter(range);
		setCurrentPage(1);
		updateURL({ price: range, page: 1 });
	};

	const handleSizeFilter = (size) => {
		setSizeFilter(size);
		setCurrentPage(1);
		updateURL({ size: size, page: 1 });
	};

	const handleColorFilter = (color) => {
		setColorFilter(color);
		setCurrentPage(1);
		updateURL({ color: color, page: 1 });
	};

	const handleRatingFilter = (rating) => {
		setRatingFilter(rating);
		setCurrentPage(1);
		updateURL({ rating: rating, page: 1 });
	};

	const handleStockFilter = (stock) => {
		setStockFilter(stock);
		setCurrentPage(1);
		updateURL({ stock: stock, page: 1 });
	};

	const handleClearFilters = () => {
		setSortBy("default");
		setPriceFilter("all");
		setSizeFilter("all");
		setColorFilter("all");
		setRatingFilter("all");
		setStockFilter("all");
		setCurrentPage(1);
		setSearchParams({});
	};
 
	const searchFilteredProducts = mergedProducts.filter(product => {
		if (!searchQuery) return true;
		const query = searchQuery.toLowerCase();
		return (
			product.name.toLowerCase().includes(query) ||
			product.description?.toLowerCase().includes(query) ||
			product.category.toLowerCase().includes(query) ||
			product.tags?.some(tag => tag.toLowerCase().includes(query))
		);
	});

	const priceFilteredProducts = searchFilteredProducts.filter(product => {
		if (priceFilter === "all") return true;
		const price = product.onSale && product.salePrice ? product.salePrice : product.price;
		
		switch(priceFilter) {
			case "0-50": return price >= 0 && price <= 50;
			case "50-100": return price > 50 && price <= 100;
			case "100-150": return price > 100 && price <= 150;
			case "150-200": return price > 150 && price <= 200;
			case "200+": return price > 200;
			default: return true;
		}
	});
 
	const sizeFilteredProducts = priceFilteredProducts.filter(product => {
		if (sizeFilter === "all") return true;
		if (!product.variants || product.variants.length === 0) {
			return true;
		}
		 
		return product.variants.some(v => 
			v.size.toLowerCase() === sizeFilter.toLowerCase() && v.stock > 0
		);
	});
 
	const colorFilteredProducts = sizeFilteredProducts.filter(product => {
		if (colorFilter === "all") return true;
		return product.colors?.some(c => c.toLowerCase().includes(colorFilter.toLowerCase()));
	});
 
	const ratingFilteredProducts = colorFilteredProducts.filter(product => {
		if (ratingFilter === "all") return true;
		const rating = parseInt(ratingFilter);
		return product.averageRating >= rating;
	});
 
	const stockFilteredProducts = ratingFilteredProducts.filter(product => {
		if (stockFilter === "all") return true;
		if (stockFilter === "in-stock") return product.totalStock > 0;
		if (stockFilter === "out-of-stock") return product.totalStock === 0;
		if (stockFilter === "low-stock") return product.totalStock > 0 && product.totalStock <= 10;
		return true;
	}); 
	const getSortedProducts = () => {
		let sorted = [...stockFilteredProducts];
		
		switch (sortBy) {
			case "low-high":
				return sorted.sort((a, b) => {
					const priceA = a.onSale && a.salePrice ? a.salePrice : a.price;
					const priceB = b.onSale && b.salePrice ? b.salePrice : b.price;
					return priceA - priceB;
				});
			case "high-low":
				return sorted.sort((a, b) => {
					const priceA = a.onSale && a.salePrice ? a.salePrice : a.price;
					const priceB = b.onSale && b.salePrice ? b.salePrice : b.price;
					return priceB - priceA;
				});
			case "new":
				return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
			case "name-az":
				return sorted.sort((a, b) => a.name.localeCompare(b.name));
			case "name-za":
				return sorted.sort((a, b) => b.name.localeCompare(a.name));
			case "rating":
				return sorted.sort((a, b) => b.averageRating - a.averageRating);
			case "popular":
				return sorted.sort((a, b) => (b.reviews?.length || 0) - (a.reviews?.length || 0));
			default:
				return sorted;
		}
	};

	const sortedProducts = getSortedProducts();
 
	const indexOfLastProduct = currentPage * productsPerPage;
	const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
	const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);
	const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

	const paginate = (pageNumber) => {
		setCurrentPage(pageNumber);
		updateURL({ page: pageNumber });
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};
 
	const availableColors = [...new Set(mergedProducts.flatMap(p => p.colors || []))]
		.filter(color => typeof color === 'string' && color.trim() !== '');
 
	const activeFiltersCount = [priceFilter, sizeFilter, colorFilter, ratingFilter, stockFilter]
		.filter(f => f !== 'all').length;

	if (isLoading) return <LoadingSpinner />;
	

	return (
		<div> 
			<section className="breadcrumb-option">
				<div className="container">
					<div className="row">
						<div className="col-lg-12">
							<div className="breadcrumb__text">
								<h4>{searchQuery ? `Search: "${searchQuery}"` : (category === "all" ? "All Products" : category.charAt(0).toUpperCase() + category.slice(1))}</h4>
								<div className="breadcrumb__links">
									<Link to="/">Home</Link>
									<span>{searchQuery ? 'Search Results' : (category === "all" ? "Shop" : category)}</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
			<section className="shop spad">
				<div className="container">
					<div className="row">
						<div className="col-lg-3">
							<div className="shop__sidebar">
								{activeFiltersCount > 0 && (
									<div style={{
										background: '#e53637',
										color: '#fff',
										padding: '10px 15px',
										marginBottom: '20px',
										borderRadius: '4px',
										display: 'flex',
										justifyContent: 'space-between',
										alignItems: 'center'
									}}>
										<span style={{fontWeight: '700'}}>
											{activeFiltersCount} Filter{activeFiltersCount > 1 ? 's' : ''} Active
										</span>
										<button
											onClick={handleClearFilters}
											style={{
												background: 'transparent',
												border: '1px solid #fff',
												color: '#fff',
												padding: '3px 10px',
												borderRadius: '3px',
												cursor: 'pointer',
												fontSize: '12px',
												fontWeight: '700'
											}}
										>
											Clear All
										</button>
									</div>
								)}

								<div className="shop__sidebar__accordion">
									<div className="accordion" id="accordionExample">
										<div className="card">
											<div className="card-heading">
												<a data-toggle="collapse" data-target="#collapseOne">Categories</a>
											</div>
											<div id="collapseOne" className="collapse show" data-parent="#accordionExample">
												<div className="card-body">
													<div className="shop__sidebar__categories">
														<ul className="nice-scroll">
															<li><Link to="/category/all" style={{fontWeight: category === 'all' ? 'bold' : 'normal'}}>All Products</Link></li>
															<li>
																<Link to="/sales" style={{
																	fontWeight: '700',
																	color: '#e53637',
																	display: 'flex',
																	alignItems: 'center',
																	gap: '8px'
																}}>
																	<i className="fa fa-bolt"></i>
																	Sales & Discounts
																</Link>
															</li>
															<li><Link to="/category/jeans" style={{fontWeight: category === 'jeans' ? 'bold' : 'normal'}}>Jeans</Link></li>
															<li><Link to="/category/t-shirts" style={{fontWeight: category === 't-shirts' ? 'bold' : 'normal'}}>T-Shirts</Link></li>
															<li><Link to="/category/shoes" style={{fontWeight: category === 'shoes' ? 'bold' : 'normal'}}>Shoes</Link></li>
															<li><Link to="/category/glasses" style={{fontWeight: category === 'glasses' ? 'bold' : 'normal'}}>Glasses</Link></li>
															<li><Link to="/category/jackets" style={{fontWeight: category === 'jackets' ? 'bold' : 'normal'}}>Jackets</Link></li>
															<li><Link to="/category/suits" style={{fontWeight: category === 'suits' ? 'bold' : 'normal'}}>Suits</Link></li>
															<li><Link to="/category/bags" style={{fontWeight: category === 'bags' ? 'bold' : 'normal'}}>Bags</Link></li>
															<li><Link to="/category/accessories" style={{fontWeight: category === 'accessories' ? 'bold' : 'normal'}}>Accessories</Link></li>
														</ul>
													</div>
												</div>
											</div>
										</div>
 
										<div className="card">
											<div className="card-heading">
												<a data-toggle="collapse" data-target="#collapseTwo">
													Filter Price {priceFilter !== 'all' && <span style={{color: '#e53637'}}>✓</span>}
												</a>
											</div>
											<div id="collapseTwo" className="collapse show" data-parent="#accordionExample">
												<div className="card-body">
													<div className="shop__sidebar__price">
														<ul>
															<li>
																<a 
																	href="#" 
																	onClick={(e) => { e.preventDefault(); handlePriceFilter("0-50"); }}
																	style={{fontWeight: priceFilter === "0-50" ? 'bold' : 'normal', color: priceFilter === "0-50" ? '#e53637' : '#6f6f6f'}}
																>
																	$0.00 - $50.00
																</a>
															</li>
															<li>
																<a 
																	href="#" 
																	onClick={(e) => { e.preventDefault(); handlePriceFilter("50-100"); }}
																	style={{fontWeight: priceFilter === "50-100" ? 'bold' : 'normal', color: priceFilter === "50-100" ? '#e53637' : '#6f6f6f'}}
																>
																	$50.00 - $100.00
																</a>
															</li>
															<li>
																<a 
																	href="#" 
																	onClick={(e) => { e.preventDefault(); handlePriceFilter("100-150"); }}
																	style={{fontWeight: priceFilter === "100-150" ? 'bold' : 'normal', color: priceFilter === "100-150" ? '#e53637' : '#6f6f6f'}}
																>
																	$100.00 - $150.00
																</a>
															</li>
															<li>
																<a 
																	href="#" 
																	onClick={(e) => { e.preventDefault(); handlePriceFilter("150-200"); }}
																	style={{fontWeight: priceFilter === "150-200" ? 'bold' : 'normal', color: priceFilter === "150-200" ? '#e53637' : '#6f6f6f'}}
																>
																	$150.00 - $200.00
																</a>
															</li>
															<li>
																<a 
																	href="#" 
																	onClick={(e) => { e.preventDefault(); handlePriceFilter("200+"); }}
																	style={{fontWeight: priceFilter === "200+" ? 'bold' : 'normal', color: priceFilter === "200+" ? '#e53637' : '#6f6f6f'}}
																>
																	$200.00+
																</a>
															</li>
															<li>
																<a 
																	href="#" 
																	onClick={(e) => { e.preventDefault(); handlePriceFilter("all"); }}
																	style={{fontWeight: priceFilter === "all" ? 'bold' : 'normal', color: '#e53637'}}
																>
																	All Prices
																</a>
															</li>
														</ul>
													</div>
												</div>
											</div>
										</div>
 
										<div className="card">
											<div className="card-heading">
												<a data-toggle="collapse" data-target="#collapseThree">
													Sizes {sizeFilter !== 'all' && <span style={{color: '#e53637'}}>✓</span>}
												</a>
											</div>
											<div id="collapseThree" className="collapse show" data-parent="#accordionExample">
												<div className="card-body">
													<div className="shop__sidebar__size">
														{['xs', 's', 'm', 'l', 'xl', '2xl', 'xxl', '3xl', '4xl'].map(size => (
															<label 
																key={size} 
																htmlFor={size}
																className={sizeFilter === size ? 'active' : ''}
																onClick={() => handleSizeFilter(size)}
																style={{cursor: 'pointer'}}
															>
																{size.toUpperCase()}
																<input type="radio" id={size} name="size" />
															</label>
														))}
														<label 
															htmlFor="all-sizes"
															className={sizeFilter === 'all' ? 'active' : ''}
															onClick={() => handleSizeFilter('all')}
															style={{background: sizeFilter === 'all' ? '#e53637' : '#f3f2ee', color: sizeFilter === 'all' ? '#fff' : '#6f6f6f', cursor: 'pointer'}}
														>
															All
															<input type="radio" id="all-sizes" name="size" />
														</label>
													</div>
												</div>
											</div>
										</div>
 
										{availableColors.length > 0 && (
											<div className="card">
												<div className="card-heading">
													<a data-toggle="collapse" data-target="#collapseFive">
														Colors {colorFilter !== 'all' && <span style={{color: '#e53637'}}>✓</span>}
													</a>
												</div>
												<div id="collapseFive" className="collapse show" data-parent="#accordionExample">
													<div className="card-body">
														<ul style={{listStyle: 'none', padding: 0, margin: 0}}>
															<li style={{marginBottom: '8px'}}>
																<a 
																	href="#"
																	onClick={(e) => { e.preventDefault(); handleColorFilter('all'); }}
																	style={{
																		display: 'flex',
																		alignItems: 'center',
																		color: colorFilter === 'all' ? '#e53637' : '#6f6f6f',
																		fontWeight: colorFilter === 'all' ? 'bold' : 'normal',
																		textDecoration: 'none'
																	}}
																>
																	<div style={{
																		width: '20px',
																		height: '20px',
																		borderRadius: '50%',
																		marginRight: '10px',
																		background: 'linear-gradient(45deg, #ff0000, #00ff00, #0000ff)',
																		border: '2px solid #e5e5e5'
																	}}></div>
																	All Colors
																</a>
															</li>
															{availableColors.slice(0, 15).map((color, idx) => (
																<li key={idx} style={{marginBottom: '8px'}}>
																	<a 
																		href="#"
																		onClick={(e) => { e.preventDefault(); handleColorFilter(color); }}
																		style={{
																			display: 'flex',
																			alignItems: 'center',
																			color: colorFilter === color ? '#e53637' : '#6f6f6f',
																			fontWeight: colorFilter === color ? 'bold' : 'normal',
																			textDecoration: 'none'
																		}}
																	>
																		<div style={{
																			width: '20px',
																			height: '20px',
																			borderRadius: '50%',
																			marginRight: '10px',
																			background: color,
																			border: '2px solid #e5e5e5'
																		}}></div>
																		{typeof color === 'string' ? color.charAt(0).toUpperCase() + color.slice(1) : color}
																	</a>
																</li>
															))}
														</ul>
													</div>
												</div>
											</div>
										)}
 
										<div className="card">
											<div className="card-heading">
												<a data-toggle="collapse" data-target="#collapseSix">
													Rating {ratingFilter !== 'all' && <span style={{color: '#e53637'}}>✓</span>}
												</a>
											</div>
											<div id="collapseSix" className="collapse show" data-parent="#accordionExample">
												<div className="card-body">
													<ul style={{listStyle: 'none', padding: 0}}>
														{[5, 4, 3, 2, 1].map(rating => (
															<li key={rating} style={{marginBottom: '8px'}}>
																<a 
																	href="#"
																	onClick={(e) => { e.preventDefault(); handleRatingFilter(rating.toString()); }}
																	style={{
																		display: 'flex',
																		alignItems: 'center',
																		color: ratingFilter === rating.toString() ? '#e53637' : '#6f6f6f',
																		fontWeight: ratingFilter === rating.toString() ? 'bold' : 'normal'
																	}}
																>
																	{[...Array(5)].map((_, i) => (
																		<i 
																			key={i}
																			className={i < rating ? 'fa fa-star' : 'fa fa-star-o'}
																			style={{color: '#f39c12', marginRight: '2px'}}
																		/>
																	))}
																	<span style={{marginLeft: '8px'}}>& Up</span>
																</a>
															</li>
														))}
														<li>
															<a 
																href="#"
																onClick={(e) => { e.preventDefault(); handleRatingFilter('all'); }}
																style={{
																	color: '#e53637',
																	fontWeight: ratingFilter === 'all' ? 'bold' : 'normal'
																}}
															>
																All Ratings
															</a>
														</li>
													</ul>
												</div>
											</div>
										</div>
 
										<div className="card">
											<div className="card-heading">
												<a data-toggle="collapse" data-target="#collapseSeven">
													Availability {stockFilter !== 'all' && <span style={{color: '#e53637'}}>✓</span>}
												</a>
											</div>
											<div id="collapseSeven" className="collapse show" data-parent="#accordionExample">
												<div className="card-body">
													<ul style={{listStyle: 'none', padding: 0}}>
														<li style={{marginBottom: '8px'}}>
															<a 
																href="#"
																onClick={(e) => { e.preventDefault(); handleStockFilter('in-stock'); }}
																style={{
																	color: stockFilter === 'in-stock' ? '#e53637' : '#6f6f6f',
																	fontWeight: stockFilter === 'in-stock' ? 'bold' : 'normal'
																}}
															>
																<i className="fa fa-check-circle" style={{marginRight: '8px', color: '#10b981'}}></i>
																In Stock
															</a>
														</li>
														<li style={{marginBottom: '8px'}}>
															<a 
																href="#"
																onClick={(e) => { e.preventDefault(); handleStockFilter('low-stock'); }}
																style={{
																	color: stockFilter === 'low-stock' ? '#e53637' : '#6f6f6f',
																	fontWeight: stockFilter === 'low-stock' ? 'bold' : 'normal'
																}}
															>
																<i className="fa fa-exclamation-circle" style={{marginRight: '8px', color: '#f59e0b'}}></i>
																Low Stock
															</a>
														</li>
														<li style={{marginBottom: '8px'}}>
															<a 
																href="#"
																onClick={(e) => { e.preventDefault(); handleStockFilter('out-of-stock'); }}
																style={{
																	color: stockFilter === 'out-of-stock' ? '#e53637' : '#6f6f6f',
																	fontWeight: stockFilter === 'out-of-stock' ? 'bold' : 'normal'
																}}
															>
																<i className="fa fa-times-circle" style={{marginRight: '8px', color: '#ef4444'}}></i>
																Out of Stock
															</a>
														</li>
														<li>
															<a 
																href="#"
																onClick={(e) => { e.preventDefault(); handleStockFilter('all'); }}
																style={{
																	color: '#e53637',
																	fontWeight: stockFilter === 'all' ? 'bold' : 'normal'
																}}
															>
																All Products
															</a>
														</li>
													</ul>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
 
						<div className="col-lg-9">
							<div className="shop__product__option">
								<div className="row">
									<div className="col-lg-6 col-md-6 col-sm-6">
										<div className="shop__product__option__left">
											<p>Showing {currentProducts.length} of {sortedProducts.length} Results</p>
										</div>
									</div>
									<div className="col-lg-6 col-md-6 col-sm-6">
										<div className="shop__product__option__right" style={{display: 'flex', gap: '10px', justifyContent: 'flex-end', alignItems: 'center'}}>
											 
											<div style={{display: 'flex', gap: '5px', marginRight: '15px'}}>
												<button
													onClick={() => setViewMode('grid')}
													style={{
														background: viewMode === 'grid' ? '#e53637' : '#f3f2ee',
														color: viewMode === 'grid' ? '#fff' : '#6f6f6f',
														border: 'none',
														padding: '5px 10px',
														cursor: 'pointer',
														borderRadius: '3px'
													}}
													title="Grid View"
												>
													<i className="fa fa-th"></i>
												</button>
												<button
													onClick={() => setViewMode('list')}
													style={{
														background: viewMode === 'list' ? '#e53637' : '#f3f2ee',
														color: viewMode === 'list' ? '#fff' : '#6f6f6f',
														border: 'none',
														padding: '5px 10px',
														cursor: 'pointer',
														borderRadius: '3px'
													}}
													title="List View"
												>
													<i className="fa fa-list"></i>
												</button>
											</div>

											<p style={{margin: 0}}>Sort by:</p>
											<select value={sortBy} onChange={(e) => handleSortChange(e.target.value)}>
												<option value="default">Default</option>
												<option value="low-high">Price: Low To High</option>
												<option value="high-low">Price: High To Low</option>
												<option value="new">Newest First</option>
												<option value="name-az">Name: A to Z</option>
												<option value="name-za">Name: Z to A</option>
												<option value="rating">Highest Rated</option>
												<option value="popular">Most Popular</option>
											</select>
										</div>
									</div>
								</div>
							</div>

							<div className="row">
								{currentProducts.length === 0 ? (
									<div className="col-lg-12">
										<div style={{textAlign: 'center', padding: '50px 0'}}>
											<i className="fa fa-search" style={{fontSize: '64px', color: '#e5e5e5', marginBottom: '20px'}}></i>
											<h4>No products found</h4>
											<p>Try adjusting your filters or search query</p>
											<button 
												onClick={handleClearFilters}
												className="primary-btn"
												style={{marginTop: '20px'}}
											>
												Clear All Filters
											</button>
										</div>
									</div>
								) : (
									currentProducts.map((product) => (
										<div key={product._id} className={viewMode === 'grid' ? "col-lg-4 col-md-6 col-sm-6" : "col-lg-12"}>
											<ProductCard product={product} viewMode={viewMode} />
										</div>
									))
								)}
							</div>
 
							{totalPages > 1 && (
								<div className="row">
									<div className="col-lg-12">
										<div className="product__pagination">
											{currentPage > 1 && (
												<a 
													href="#" 
													onClick={(e) => { e.preventDefault(); paginate(currentPage - 1); }}
												>
													<i className="fa fa-angle-left"></i>
												</a>
											)}

											{[...Array(totalPages)].map((_, index) => {
												const pageNumber = index + 1;
												if (
													pageNumber === 1 ||
													pageNumber === totalPages ||
													(pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
												) {
													return (
														<a
															key={pageNumber}
															href="#"
															className={currentPage === pageNumber ? 'active' : ''}
															onClick={(e) => { e.preventDefault(); paginate(pageNumber); }}
														>
															{pageNumber}
														</a>
													);
												} else if (
													pageNumber === currentPage - 2 ||
													pageNumber === currentPage + 2
												) {
													return <span key={pageNumber}>...</span>;
												}
												return null;
											})}

											{currentPage < totalPages && (
												<a 
													href="#" 
													onClick={(e) => { e.preventDefault(); paginate(currentPage + 1); }}
												>
													<i className="fa fa-angle-right"></i>
												</a>
											)}
										</div>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</section>
		</div>
	);
};

export default CategoryPage;