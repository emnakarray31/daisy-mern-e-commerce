import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useProductStore } from "../stores/useProductStore";
import ProductCard from "../components/ProductCard";
import FeaturedProducts from "../components/FeaturedProducts";
import CategoryItem from "../components/CategoryItem";
import { useActiveSales } from '../hooks/useActiveSales';
import CountdownTimer from '../components/CountdownTimer';
import axios from '../lib/axios';
import IntelligentSearch from '../components/IntelligentSearch';


const HomePage = () => {
	const { fetchFeaturedProducts, products, isLoading } = useProductStore();
	const { hasActiveSales } = useActiveSales();
	const [activeSales, setActiveSales] = useState([]);

	useEffect(() => {
		fetchFeaturedProducts();
	}, [fetchFeaturedProducts]);
	useEffect(() => {
		const fetchActiveSales = async () => {
			if (hasActiveSales) {
				try {
					const response = await axios.get('/sales/active');
					setActiveSales(response.data || []);
				} catch (error) {
					console.error('Error fetching active sales:', error);
				}
			}
		};
		fetchActiveSales();
	}, [hasActiveSales]);
	const baseCategories = [
		{ href: "/category/jeans", name: "Jeans", imageUrl: "/jeans.jpg" },
		{ href: "/category/t-shirts", name: "T-shirts", imageUrl: "/tshirts.jpg" },
		{ href: "/category/shoes", name: "Shoes", imageUrl: "/shoes.jpg" },
		{ href: "/category/glasses", name: "Glasses", imageUrl: "/glasses.jpg" },
		{ href: "/category/jackets", name: "Jackets", imageUrl: "/jackets.png" },
		{ href: "/category/suits", name: "Suits", imageUrl: "/suits.jpg" },
		{ href: "/category/bags", name: "Bags", imageUrl: "/bags.jpg" },
		{ href: "/category/accessories", name: "Accessories", imageUrl: "/accessories.jpg" },
	];
	const categories = hasActiveSales 
		? [
				{ href: "/sales", name: "Sales & Discounts", imageUrl: "/sales.jpg", isSale: true },
				...baseCategories
			]
		: baseCategories;
	const heroCategories = hasActiveSales
		? [
				{ href: "/sales", name: "Sales & Discounts", isSale: true },
				...baseCategories
			]
		: baseCategories;

	return (
		<div style={{ margin: 0, padding: 0, overflow: 'hidden' }}>
			<section className="hero" style={{ paddingBottom: 0, marginBottom: 0 }}>
				<div className="container">
					<div className="row">
						<div className="col-lg-3">
							<div className="hero__categories">
								<div className="hero__categories__all">
									<i className="fa fa-bars"></i>
									<span>All Categories</span>
								</div>
								<ul style={{listStyle: 'none', padding: '10px', margin: 0, background: '#f3f6fa'}}>
									{heroCategories.map((category) => (
										<li key={category.name}>
											<Link to={category.href} style={{
												display: category.isSale ? 'flex' : 'block',
												alignItems: category.isSale ? 'center' : 'initial',
												gap: category.isSale ? '8px' : 'initial',
												padding: '10px 0',
												color: category.isSale ? '#e53637' : '#6f6f6f',
												fontSize: '14px',
												fontWeight: category.isSale ? '700' : 'normal',
												transition: 'all 0.3s'
											}}>
												{category.isSale && <i className="fa fa-bolt"></i>}
												{category.name}
											</Link>
										</li>
									))}
								</ul>
							</div>
						</div>
						<div className="col-lg-9">
							
							<div className="col-lg-9">
								<IntelligentSearch /> 
							</div>
							<div className="hero__item set-bg" style={{
								backgroundImage: 'linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.3)), url(https://i.pinimg.com/736x/ee/90/72/ee9072f0919121995d2d42e4c91293f7.jpg)',

								
								height: '550px',
								backgroundSize: 'cover',
								backgroundPosition: 'center',
								display: 'flex',
								alignItems: 'center',
								padding: '0 75px',
								marginTop: '30px',
								position: 'relative'
							}}>
								<div className="hero__text" style={{ zIndex: 2 }}>
									<span style={{
										fontSize: '12px',
										color: '#fff',
										fontWeight: '700',
										textTransform: 'uppercase',
										letterSpacing: '4px',
										marginBottom: '15px',
										display: 'block',
										background: '#e53637',
										padding: '8px 20px',
										display: 'inline-block'
									}}>
										WINTER COLLECTION
									</span>
									<h2 style={{
										fontSize: '64px',
										color: '#ffffff',
										fontWeight: '900',
										lineHeight: '1.1',
										marginBottom: '25px',
										marginTop: '20px',
										textShadow: '3px 3px 10px rgba(0,0,0,0.5)'
									}}>
										Fall - Winter<br />Collections
									</h2>
									<p style={{
										marginBottom: '35px',
										color: '#ffffff',
										fontSize: '16px',
										lineHeight: '1.8',
										maxWidth: '500px',
										textShadow: '1px 1px 3px rgba(0,0,0,0.5)'
									}}>
										A specialist label creating luxury essentials. Ethically crafted<br />
										with an unwavering commitment to exceptional quality.
									</p>
									<Link to="/category/all" className="primary-btn" style={{
										padding: '18px 50px',
										fontSize: '13px',
										letterSpacing: '2px'
									}}>
										SHOP NOW <span className="arrow_right"></span>
									</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
			<section style={{ padding: '80px 0', background: '#fafafa', margin: 0 }}>
				<div className="container">
					<div style={{ textAlign: 'center', marginBottom: '60px' }}>
						<h2 style={{
							fontSize: '42px',
							fontWeight: '800',
							color: '#111',
							margin: '0 0 15px 0',
							letterSpacing: '-1px'
						}}>
							Shop By Category
						</h2>
						<div style={{
							width: '60px',
							height: '3px',
							background: '#e53637',
							margin: '0 auto'
						}}></div>
					</div>
					<div className="row" style={{ rowGap: '30px' }}>
						{categories.map((category) => (
							<div key={category.name} className="col-lg-3 col-md-6" style={{ marginBottom: '30px' }}>
								<Link to={category.href} style={{ textDecoration: 'none' }}>
									<div style={{
										position: 'relative',
										overflow: 'hidden',
										borderRadius: '12px',
										height: '280px',
										cursor: 'pointer',
										transition: 'all 0.4s ease',
										boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
									}}
									onMouseEnter={(e) => {
										e.currentTarget.style.transform = 'translateY(-8px)';
										e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
									}}
									onMouseLeave={(e) => {
										e.currentTarget.style.transform = 'translateY(0)';
										e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
									}}>
										{category.isSale && (
											<div style={{
												position: 'absolute',
												top: '15px',
												right: '15px',
												background: '#e53637',
												color: '#fff',
												padding: '8px 15px',
												borderRadius: '20px',
												fontSize: '11px',
												fontWeight: '700',
												letterSpacing: '1px',
												zIndex: 2,
												boxShadow: '0 4px 10px rgba(229, 54, 55, 0.4)',
												animation: 'pulse 2s infinite'
											}}>
												<i className="fa fa-bolt" style={{ marginRight: '5px' }}></i>
												HOT DEALS
											</div>
										)}
										<div style={{
											backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.4)), url(${category.imageUrl})`,
											backgroundSize: 'cover',
											backgroundPosition: 'center',
											height: '100%',
											display: 'flex',
											alignItems: 'flex-end',
											padding: '25px'
										}}>
											<div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%' }}>
												{category.isSale && (
													<i className="fa fa-bolt" style={{
														color: '#fff',
														fontSize: '24px',
														textShadow: '0 2px 8px rgba(0,0,0,0.3)'
													}}></i>
												)}
												<h3 style={{
													color: '#fff',
													fontSize: '24px',
													fontWeight: '700',
													margin: 0,
													textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
												}}>
													{category.name}
												</h3>
											</div>
										</div>
									</div>
								</Link>
							</div>
						))}
					</div>
				</div>
			</section>
			<section style={{ margin: 0, padding: 0, height: '450px', display: 'flex' }}>
				<div style={{
					flex: 1,
					backgroundImage: 'linear-gradient(rgba(137, 81, 41, 0.85), rgba(137, 81, 41, 0.85)), url(../../../../public/vogue.jpg)',
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					padding: '40px'
				}}>
					<div style={{ textAlign: 'center', color: '#fff', maxWidth: '500px' }}>
						<h3 style={{
							fontSize: '38px',
							fontWeight: '800',
							marginBottom: '20px',
							lineHeight: '1.2'
						}}>
							Premium Quality<br />Guaranteed
						</h3>
						<p style={{
							fontSize: '16px',
							lineHeight: '1.7',
							opacity: 0.95,
							marginBottom: '30px'
						}}>
							Every piece is ethically crafted with sustainable materials
						</p>
						<Link to="/category/all" style={{
							display: 'inline-block',
							padding: '14px 35px',
							background: '#fff',
							color: '#895129',
							textDecoration: 'none',
							fontWeight: '700',
							fontSize: '13px',
							letterSpacing: '1.5px',
							borderRadius: '30px',
							transition: 'all 0.3s'
						}}>
							DISCOVER MORE
						</Link>
					</div>
				</div>
				<div style={{
					flex: 1,
					backgroundImage: 'linear-gradient(rgba(229, 54, 55, 0.85), rgba(229, 54, 55, 0.85)), url(../../../../public/chanel.jpg)',
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					padding: '40px'
				}}>
					<div style={{ textAlign: 'center', color: '#fff', maxWidth: '500px' }}>
						<div style={{
							fontSize: '18px',
							fontWeight: '700',
							letterSpacing: '3px',
							marginBottom: '15px',
							opacity: 0.95
						}}>
							{hasActiveSales && activeSales.length > 0 ? activeSales[0].name.toUpperCase() : 'EXCLUSIVE OFFER'}
						</div>
						<h3 style={{
							fontSize: '56px',
							fontWeight: '900',
							marginBottom: '20px',
							lineHeight: '1'
						}}>
							{hasActiveSales && activeSales.length > 0 
								? `${activeSales[0].discountValue}${activeSales[0].discountType === 'percentage' ? '%' : '$'} OFF`
								: '50% OFF'
							}
						</h3>
						{!hasActiveSales && (
							<div style={{
								display: 'inline-block',
								background: 'rgba(255, 255, 255, 0.2)',
								padding: '6px 20px',
								borderRadius: '20px',
								fontSize: '12px',
								fontWeight: '700',
								letterSpacing: '2px',
								marginBottom: '15px',
								border: '2px solid rgba(255, 255, 255, 0.3)'
							}}>
								COMING SOON
							</div>
						)}
						<p style={{
							fontSize: '16px',
							lineHeight: '1.7',
							opacity: 0.95,
							marginBottom: '30px'
						}}>
							{hasActiveSales && activeSales.length > 0 && activeSales[0].description
								? activeSales[0].description
								: 'Limited time sale on selected items'
							}
						</p>
						<Link to={hasActiveSales ? "/sales" : "/category/all"} style={{
							display: 'inline-block',
							padding: '14px 35px',
							background: '#fff',
							color: '#e53637',
							textDecoration: 'none',
							fontWeight: '700',
							fontSize: '13px',
							letterSpacing: '1.5px',
							borderRadius: '30px',
							transition: 'all 0.3s'
						}}>
							{hasActiveSales ? 'SHOP SALE' : 'SHOP NOW'}
						</Link>
					</div>
				</div>
			</section>
			{!isLoading && products && products.length > 0 && (
				<div style={{ padding: '80px 0', margin: 0, background: '#fff' }}>
					<FeaturedProducts 
						featuredProducts={products} 
						title="Featured Products"
					/>
				</div>
			)}
			<section className="product" style={{ padding: '80px 0', margin: 0, background: '#fafafa' }}>
				<div className="container">
					<div style={{ textAlign: 'center', marginBottom: '60px' }}>
						<h2 style={{
							fontSize: '42px',
							fontWeight: '800',
							color: '#111',
							margin: '0 0 15px 0',
							letterSpacing: '-1px'
						}}>
							Best Sellers
						</h2>
						<div style={{
							width: '60px',
							height: '3px',
							background: '#e53637',
							margin: '0 auto 30px auto'
						}}></div>
						<ul className="filter__controls" style={{
							listStyle: 'none',
							textAlign: 'center',
							padding: 0,
							margin: 0
						}}>
							<li className="active" data-filter="*" style={{
								display: 'inline-block',
								fontSize: '14px',
								color: '#111111',
								margin: '0 20px',
								cursor: 'pointer',
								fontWeight: '700',
								padding: '8px 20px',
								borderBottom: '2px solid #e53637'
							}}>
								Best Sellers
							</li>
							{hasActiveSales && (
								<li style={{
									display: 'inline-block',
									fontSize: '14px',
									margin: '0 20px',
									padding: '8px 20px'
								}}>
									<Link to="/sales" style={{
										color: '#e53637',
										textDecoration: 'none',
										fontWeight: '700',
										display: 'flex',
										alignItems: 'center',
										gap: '5px'
									}}>
										<i className="fa fa-bolt"></i>
										Hot Sales
									</Link>
								</li>
							)}
						</ul>
					</div>
					<div className="row product__filter">
						{!isLoading && products && products.length > 0 && products.slice(0, 8).map((product) => (
							<div key={product._id} className="col-lg-3 col-md-6 col-sm-6" style={{ marginBottom: '30px' }}>
								<ProductCard product={product} />
							</div>
						))}
					</div>
				</div>
			</section>

 			{hasActiveSales && activeSales.length > 0 && (
				<section className="categories" style={{ padding: '80px 0', margin: 0, background: '#fff' }}>
					<div className="container">
						<div className="row" style={{ 
							display: 'flex', 
							alignItems: 'center',
							justifyContent: 'space-between',
							paddingLeft: '90px'  
						}}>
							<div className="col-lg-3">
								<div className="categories__text">
									<h2 style={{ fontSize: '36px', fontWeight: '800', lineHeight: '1.3' }}>
										Clothes <br /> 
										<span style={{ color: '#e53637' }}>Shoes Collection</span> <br /> 
										Accessories
									</h2>
								</div>
							</div>
							
							<div className="col-lg-3" style={{ 
								display: 'flex', 
								justifyContent: 'center',
								alignItems: 'center',
								
								}}>
								<div style={{
									width: '220px',
									height: '220px',
									borderRadius: '50%',
									background: 'linear-gradient(135deg, #1a1a1a 0%, #000000 100%)',
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
									justifyContent: 'center', 
									position: 'relative'
								}}>
									<span style={{
										fontSize: '14px',
										color: '#fff',
										fontWeight: '600',
										letterSpacing: '2px',
										marginBottom: '10px',
										textTransform: 'uppercase'
									}}>
										Save Up To
									</span>
									<h2 style={{
										fontSize: '56px',
										fontWeight: '900',
										color: '#fff',
										margin: 0,
										lineHeight: '1'
									}}>
										{activeSales[0].discountType === 'percentage' 
											? `${activeSales[0].discountValue}%` 
											: `$${activeSales[0].discountValue}`}
									</h2>
									<span style={{
										fontSize: '12px',
										color: '#fff',
										fontWeight: '600',
										marginTop: '8px',
										opacity: 0.9,
										textTransform: 'uppercase',
										letterSpacing: '1px'
									}}>
										OFF
									</span>
								</div>
							</div>
							
							<div className="col-lg-5">
								<div className="categories__deal__countdown" style={{
									textAlign: 'left'
								}}>
									<span style={{
										fontSize: '14px',
										color: '#e53637',
										fontWeight: '700',
										letterSpacing: '2px',
										textTransform: 'uppercase',
										display: 'block',
										marginBottom: '15px'
									}}>
										Deal Of The Week
									</span>
									<h2 style={{
										fontSize: '32px',
										fontWeight: '800',
										color: '#111',
										marginBottom: '20px',
										lineHeight: '1.2'
									}}>
										{activeSales[0].name}
									</h2>
									<CountdownTimer endDate={activeSales[0].endDate} />
									<Link to="/sales" className="primary-btn" style={{
										marginTop: '25px',
										display: 'inline-block',
										padding: '14px 40px',
										fontSize: '13px',
										fontWeight: '700',
										letterSpacing: '2px'
									}}>
										SHOP NOW
									</Link>
								</div>
							</div>
						</div>
					</div>
				</section>
			)}
	 
		<footer className="footer" style={{ paddingTop: '60px', background: '#1a1a1a', color: '#fff', overflow: 'hidden' }}>

					<div className="container">
						<div className="row justify-content-between"> 
						<div className="col-lg-4 col-md-6 mb-5 mb-lg-0">
							<div className="footer__about">
							<div className="footer__logo mb-4">
								<Link to="/">
								<h3 style={{ color: '#fff', fontWeight: '800', fontSize: '28px' }}>
									Daisy <span style={{ color: '#e53637' }}>and</span> More
								</h3>
								</Link>
							</div>
							<p style={{ color: '#999', lineHeight: '1.8', marginBottom: '20px' }}>
							Driven by your needs, designed for you.</p>
							</div>
						</div>

						<div className="col-lg-2 col-md-3 col-sm-6 mb-5 mb-lg-0">
	<div className="footer__widget">
		<h6 style={{ color: '#fff', marginBottom: '25px', fontSize: '16px' }}>Shopping</h6>
		<ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
			<li style={{ marginBottom: '12px' }}>
				<Link to="/category/all" style={{ color: '#999', textDecoration: 'none', transition: 'color 0.3s' }}
					onMouseEnter={e => e.target.style.color = '#fff'}
					onMouseLeave={e => e.target.style.color = '#999'}>
					Clothing Store
				</Link>
			</li>
			<li style={{ marginBottom: '12px' }}>
				<Link to="/category/shoes" style={{ color: '#999', textDecoration: 'none', transition: 'color 0.3s' }}
					onMouseEnter={e => e.target.style.color = '#fff'}
					onMouseLeave={e => e.target.style.color = '#999'}>
					Trending Shoes
				</Link>
			</li>
			<li style={{ marginBottom: '12px' }}>
				<Link to="/category/accessories" style={{ color: '#999', textDecoration: 'none', transition: 'color 0.3s' }}
					onMouseEnter={e => e.target.style.color = '#fff'}
					onMouseLeave={e => e.target.style.color = '#999'}>
					Accessories
				</Link>
			</li>
			<li style={{ marginBottom: '12px' }}>
				<Link to="/sales" style={{ color: '#999', textDecoration: 'none', transition: 'color 0.3s' }}
					onMouseEnter={e => e.target.style.color = '#fff'}
					onMouseLeave={e => e.target.style.color = '#999'}>
					Sale
				</Link>
			</li>
		</ul>
	</div>
</div>

					
<div className="col-lg-3 col-md-3 col-sm-6 mb-5 mb-lg-0">
	<div className="footer__widget">
		<h6 style={{ color: '#fff', marginBottom: '25px', fontSize: '16px' }}>Customer Care</h6>
		<ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
			{/* Contact Us */}
			<li style={{ marginBottom: '12px' }}>
				<Link 
					to="/contact" 
					style={{ color: '#999', textDecoration: 'none', transition: 'color 0.3s' }}
					onMouseEnter={e => e.target.style.color = '#fff'}
					onMouseLeave={e => e.target.style.color = '#999'}
				>
					Contact Us
				</Link>
			</li>

			{/* Payment Methods */}
			<li style={{ marginBottom: '12px' }}>
				<Link 
					to="/payment-methods" 
					style={{ color: '#999', textDecoration: 'none', transition: 'color 0.3s' }}
					onMouseEnter={e => e.target.style.color = '#fff'}
					onMouseLeave={e => e.target.style.color = '#999'}
				>
					Payment Methods
				</Link>
			</li>

			{/* Delivery */}
			<li style={{ marginBottom: '12px' }}>
				<Link 
					to="/delivery" 
					style={{ color: '#999', textDecoration: 'none', transition: 'color 0.3s' }}
					onMouseEnter={e => e.target.style.color = '#fff'}
					onMouseLeave={e => e.target.style.color = '#999'}
				>
					Delivery
				</Link>
			</li>

			{/* Return & Exchanges */}
			<li style={{ marginBottom: '12px' }}>
				<Link 
					to="/returns" 
					style={{ color: '#999', textDecoration: 'none', transition: 'color 0.3s' }}
					onMouseEnter={e => e.target.style.color = '#fff'}
					onMouseLeave={e => e.target.style.color = '#999'}
				>
					Return & Exchanges
				</Link>
			</li>
		</ul>
	</div>
</div>

						</div>

						<div className="row mt-5 pt-4 border-top border-secondary">
						<div className="col-12 text-center">
							<p style={{ color: '#666', margin: 0, fontSize: '14px' }}>
							Copyright © 2025 All rights reserved | Daisy and More
							</p>
						</div>
						</div>
					</div>
	</footer>



			<style>{`
				@keyframes pulse {
					0%, 100% {
						transform: scale(1);
					}
					50% {
						transform: scale(1.05);
					}
				}
			`}</style>
		</div>
	);
};

export default HomePage;