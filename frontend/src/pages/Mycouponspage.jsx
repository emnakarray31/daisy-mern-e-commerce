import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import axios from "../lib/axios";
import toast from "react-hot-toast";

const MyCouponsPage = () => {
	const { user } = useUserStore();
	const [coupons, setCoupons] = useState({ myCoupons: [], publicCoupons: [] });
	const [loading, setLoading] = useState(true);
	const [activeTab, setActiveTab] = useState("all");
	const [copiedCode, setCopiedCode] = useState(null);

	useEffect(() => {
		if (user) {
			fetchCoupons();
		}
	}, [user]);

	const fetchCoupons = async () => {
		try {
			setLoading(true);
			const res = await axios.get("/coupons/my-coupons");
			setCoupons(res.data);
		} catch (error) {
			console.error("Error fetching coupons:", error);
			toast.error("Failed to load coupons");
		} finally {
			setLoading(false);
		}
	};

	const copyToClipboard = (code) => {
		navigator.clipboard.writeText(code);
		setCopiedCode(code);
		toast.success("Code copied to clipboard!");
		setTimeout(() => setCopiedCode(null), 2000);
	};

	const getDaysRemaining = (expirationDate) => {
		const now = new Date();
		const expiry = new Date(expirationDate);
		const diffTime = expiry - now;
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		return diffDays;
	};

	const getTypeIcon = (type) => {
		switch (type) {
			case 'percentage':
				return 'fa-percent';
			case 'fixed':
				return 'fa-dollar';
			case 'freeShipping':
				return 'fa-truck';
			default:
				return 'fa-tag';
		}
	};

	const getTypeColor = (type) => {
		switch (type) {
			case 'percentage':
				return '#e53637';
			case 'fixed':
				return '#10b981';
			case 'freeShipping':
				return '#3b82f6';
			default:
				return '#666';
		}
	};

 	const getFilteredCoupons = () => {
		const allCoupons = [...coupons.myCoupons, ...coupons.publicCoupons];
		
		switch (activeTab) {
			case 'personal':
				return coupons.myCoupons;
			case 'public':
				return coupons.publicCoupons;
			default:
				return allCoupons;
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
									<h4>My Coupons</h4>
									<div className="breadcrumb__links">
										<Link to="/">Home</Link>
										<span>My Coupons</span>
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
							<h3>Please login to view your coupons</h3>
							<p style={{color: '#6f6f6f', marginBottom: '30px'}}>
								Sign in to see your available discount codes
							</p>
							<Link to="/login" className="primary-btn">Login</Link>
						</div>
					</div>
				</section>
			</div>
		);
	}

	const filteredCoupons = getFilteredCoupons();

	return (
		<div>
 			<section className="breadcrumb-option">
				<div className="container">
					<div className="row">
						<div className="col-lg-12">
							<div className="breadcrumb__text">
								<h4>My Coupons</h4>
								<div className="breadcrumb__links">
									<Link to="/">Home</Link>
									<Link to="/account">My Account</Link>
									<span>My Coupons</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

 			<section className="shop spad">
				<div className="container">
 					<div style={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						marginBottom: '40px',
						flexWrap: 'wrap',
						gap: '20px'
					}}>
						<div>
							<h2 style={{
								fontSize: '28px',
								fontWeight: '700',
								color: '#111',
								margin: '0 0 10px 0'
							}}>
								<i className="fa fa-ticket" style={{marginRight: '15px', color: '#e53637'}}></i>
								My Discount Codes
							</h2>
							<p style={{color: '#666', margin: 0}}>
								Use these codes at checkout to save on your orders
							</p>
						</div>

						
						<div style={{
							display: 'flex',
							gap: '20px'
						}}>
							<div style={{
								textAlign: 'center',
								padding: '15px 25px',
								background: '#f9f9f9',
								borderRadius: '8px'
							}}>
								<div style={{fontSize: '24px', fontWeight: '700', color: '#e53637'}}>
									{coupons.myCoupons.length}
								</div>
								<div style={{fontSize: '12px', color: '#666', textTransform: 'uppercase'}}>
									Personal
								</div>
							</div>
							<div style={{
								textAlign: 'center',
								padding: '15px 25px',
								background: '#f9f9f9',
								borderRadius: '8px'
							}}>
								<div style={{fontSize: '24px', fontWeight: '700', color: '#3b82f6'}}>
									{coupons.publicCoupons.length}
								</div>
								<div style={{fontSize: '12px', color: '#666', textTransform: 'uppercase'}}>
									Public
								</div>
							</div>
						</div>
					</div>

  					<div style={{
						display: 'flex',
						gap: '10px',
						marginBottom: '30px',
						borderBottom: '2px solid #f0f0f0',
						paddingBottom: '15px'
					}}>
						{[
							{ id: 'all', label: 'All Coupons', count: coupons.myCoupons.length + coupons.publicCoupons.length },
							{ id: 'personal', label: 'Personal', count: coupons.myCoupons.length },
							{ id: 'public', label: 'Public Offers', count: coupons.publicCoupons.length }
						].map(tab => (
							<button
								key={tab.id}
								onClick={() => setActiveTab(tab.id)}
								style={{
									padding: '12px 24px',
									background: activeTab === tab.id ? '#111' : 'transparent',
									color: activeTab === tab.id ? '#fff' : '#666',
									border: 'none',
									borderRadius: '4px',
									fontSize: '14px',
									fontWeight: '600',
									cursor: 'pointer',
									transition: 'all 0.3s',
									display: 'flex',
									alignItems: 'center',
									gap: '8px'
								}}
							>
								{tab.label}
								<span style={{
									background: activeTab === tab.id ? 'rgba(255,255,255,0.2)' : '#f0f0f0',
									padding: '2px 8px',
									borderRadius: '10px',
									fontSize: '12px'
								}}>
									{tab.count}
								</span>
							</button>
						))}
					</div>

 					{loading ? (
						<div style={{textAlign: 'center', padding: '60px 0'}}>
							<i className="fa fa-spinner fa-spin" style={{fontSize: '40px', color: '#e53637'}}></i>
							<p style={{marginTop: '20px', color: '#666'}}>Loading your coupons...</p>
						</div>
					) : filteredCoupons.length === 0 ? (
 						<div style={{
							textAlign: 'center',
							padding: '80px 20px',
							background: '#f9f9f9',
							borderRadius: '12px'
						}}>
							<i className="fa fa-ticket" style={{
								fontSize: '80px',
								color: '#ddd',
								marginBottom: '20px',
								display: 'block'
							}}></i>
							<h3 style={{color: '#333', marginBottom: '10px'}}>No coupons available</h3>
							<p style={{color: '#666', marginBottom: '30px'}}>
								{activeTab === 'personal' 
									? "You don't have any personal discount codes yet. Make a purchase to earn rewards!"
									: activeTab === 'public'
									? "No public promotions available at the moment."
									: "Check back later for new discount codes and promotions!"
								}
							</p>
							<Link to="/category/all" className="primary-btn">
								Start Shopping
							</Link>
						</div>
					) : (
 						<div style={{
							display: 'grid',
							gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
							gap: '25px'
						}}>
							{filteredCoupons.map((coupon) => {
								const daysRemaining = getDaysRemaining(coupon.expirationDate);
								const isExpiringSoon = daysRemaining <= 3;
								const typeColor = getTypeColor(coupon.type);

								return (
									<div
										key={coupon._id}
										style={{
											background: '#fff',
											borderRadius: '12px',
											overflow: 'hidden',
											boxShadow: '0 2px 15px rgba(0,0,0,0.08)',
											border: '1px solid #f0f0f0',
											position: 'relative',
											transition: 'all 0.3s'
										}}
										onMouseEnter={(e) => {
											e.currentTarget.style.transform = 'translateY(-5px)';
											e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.12)';
										}}
										onMouseLeave={(e) => {
											e.currentTarget.style.transform = 'translateY(0)';
											e.currentTarget.style.boxShadow = '0 2px 15px rgba(0,0,0,0.08)';
										}}
									>
 										{coupon.category === 'personal' && (
											<div style={{
												position: 'absolute',
												top: '15px',
												right: '15px',
												background: '#fef3c7',
												color: '#b45309',
												padding: '4px 10px',
												borderRadius: '4px',
												fontSize: '11px',
												fontWeight: '700',
												textTransform: 'uppercase'
											}}>
												<i className="fa fa-star" style={{marginRight: '5px'}}></i>
												Just for you
											</div>
										)}

 										<div style={{
											background: `linear-gradient(135deg, ${typeColor} 0%, ${typeColor}dd 100%)`,
											padding: '30px 25px',
											color: '#fff',
											position: 'relative',
											overflow: 'hidden'
										}}>
 											<div style={{
												position: 'absolute',
												top: '-20px',
												right: '-20px',
												width: '100px',
												height: '100px',
												borderRadius: '50%',
												background: 'rgba(255,255,255,0.1)'
											}}></div>
											<div style={{
												position: 'absolute',
												bottom: '-30px',
												left: '-30px',
												width: '80px',
												height: '80px',
												borderRadius: '50%',
												background: 'rgba(255,255,255,0.1)'
											}}></div>
 
											<div style={{
												width: '50px',
												height: '50px',
												borderRadius: '50%',
												background: 'rgba(255,255,255,0.2)',
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
												marginBottom: '15px'
											}}>
												<i className={`fa ${getTypeIcon(coupon.type)}`} style={{fontSize: '20px'}}></i>
											</div>
 
											<div style={{
												fontSize: '36px',
												fontWeight: '700',
												marginBottom: '5px',
												textShadow: '0 2px 4px rgba(0,0,0,0.2)'
											}}>
												{coupon.type === 'percentage' && `${coupon.discountValue}% OFF`}
												{coupon.type === 'fixed' && `$${coupon.discountValue} OFF`}
												{coupon.type === 'freeShipping' && 'FREE SHIPPING'}
											</div>
 
											{coupon.description && (
												<p style={{
													fontSize: '14px',
													opacity: 0.9,
													margin: 0
												}}>
													{coupon.description}
												</p>
											)}
										</div>

 										<div style={{padding: '25px'}}>
 											<div style={{
												display: 'flex',
												alignItems: 'center',
												gap: '10px',
												marginBottom: '20px'
											}}>
												<div style={{
													flex: 1,
													background: '#f5f5f5',
													border: '2px dashed #ddd',
													borderRadius: '6px',
													padding: '12px 15px',
													fontFamily: 'monospace',
													fontSize: '18px',
													fontWeight: '700',
													color: '#111',
													letterSpacing: '2px',
													textAlign: 'center'
												}}>
													{coupon.code}
												</div>
												<button
													onClick={() => copyToClipboard(coupon.code)}
													style={{
														padding: '12px 20px',
														background: copiedCode === coupon.code ? '#10b981' : '#111',
														color: '#fff',
														border: 'none',
														borderRadius: '6px',
														cursor: 'pointer',
														transition: 'all 0.3s',
														fontSize: '14px',
														fontWeight: '600'
													}}
												>
													{copiedCode === coupon.code ? (
														<><i className="fa fa-check"></i></>
													) : (
														<><i className="fa fa-copy"></i></>
													)}
												</button>
											</div>

 											<div style={{
												display: 'flex',
												flexDirection: 'column',
												gap: '10px',
												fontSize: '13px',
												color: '#666'
											}}>
 												{coupon.minimumPurchase > 0 && (
													<div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
														<i className="fa fa-shopping-cart" style={{width: '16px', color: '#999'}}></i>
														Min. purchase: <strong style={{color: '#111'}}>${coupon.minimumPurchase.toFixed(2)}</strong>
													</div>
												)}

												
												{coupon.maxDiscount && (
													<div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
														<i className="fa fa-arrow-down" style={{width: '16px', color: '#999'}}></i>
														Max discount: <strong style={{color: '#111'}}>${coupon.maxDiscount.toFixed(2)}</strong>
													</div>
												)}

												 
												<div style={{
													display: 'flex',
													alignItems: 'center',
													gap: '8px',
													color: isExpiringSoon ? '#e53637' : '#666'
												}}>
													<i className="fa fa-clock-o" style={{width: '16px'}}></i>
													{isExpiringSoon ? (
														<strong>
															{daysRemaining <= 0 ? 'Expires today!' : `Expires in ${daysRemaining} day${daysRemaining > 1 ? 's' : ''}!`}
														</strong>
													) : (
														<>Expires: {new Date(coupon.expirationDate).toLocaleDateString('en-US', {
															month: 'short',
															day: 'numeric',
															year: 'numeric'
														})}</>
													)}
												</div>
											</div>

											 
											<Link
												to="/cart"
												style={{
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center',
													gap: '10px',
													width: '100%',
													padding: '14px',
													background: '#111',
													color: '#fff',
													textDecoration: 'none',
													borderRadius: '6px',
													fontSize: '14px',
													fontWeight: '700',
													marginTop: '20px',
													transition: 'all 0.3s'
												}}
												onMouseEnter={(e) => e.target.style.background = '#333'}
												onMouseLeave={(e) => e.target.style.background = '#111'}
											>
												<i className="fa fa-shopping-bag"></i>
												Use This Coupon
											</Link>
										</div>
									</div>
								);
							})}
						</div>
					)}

					 
					<div style={{
						marginTop: '60px',
						padding: '40px',
						background: '#f9f9f9',
						borderRadius: '12px'
					}}>
						<h4 style={{
							fontSize: '20px',
							fontWeight: '700',
							color: '#111',
							marginBottom: '25px'
						}}>
							<i className="fa fa-info-circle" style={{marginRight: '10px', color: '#3b82f6'}}></i>
							How to use your coupons
						</h4>
						<div style={{
							display: 'grid',
							gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
							gap: '25px'
						}}>
							<div style={{display: 'flex', gap: '15px'}}>
								<div style={{
									width: '40px',
									height: '40px',
									borderRadius: '50%',
									background: '#e53637',
									color: '#fff',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									fontWeight: '700',
									flexShrink: 0
								}}>1</div>
								<div>
									<h6 style={{margin: '0 0 5px 0', fontWeight: '600'}}>Copy the code</h6>
									<p style={{margin: 0, fontSize: '14px', color: '#666'}}>
										Click the copy button next to your coupon code
									</p>
								</div>
							</div>
							<div style={{display: 'flex', gap: '15px'}}>
								<div style={{
									width: '40px',
									height: '40px',
									borderRadius: '50%',
									background: '#e53637',
									color: '#fff',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									fontWeight: '700',
									flexShrink: 0
								}}>2</div>
								<div>
									<h6 style={{margin: '0 0 5px 0', fontWeight: '600'}}>Add items to cart</h6>
									<p style={{margin: 0, fontSize: '14px', color: '#666'}}>
										Shop and add your favorite items to the cart
									</p>
								</div>
							</div>
							<div style={{display: 'flex', gap: '15px'}}>
								<div style={{
									width: '40px',
									height: '40px',
									borderRadius: '50%',
									background: '#e53637',
									color: '#fff',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									fontWeight: '700',
									flexShrink: 0
								}}>3</div>
								<div>
									<h6 style={{margin: '0 0 5px 0', fontWeight: '600'}}>Apply at checkout</h6>
									<p style={{margin: 0, fontSize: '14px', color: '#666'}}>
										Paste your code in the discount field and enjoy!
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
};

export default MyCouponsPage;