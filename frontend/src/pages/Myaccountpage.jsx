import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import axios from "../lib/axios";
import toast from "react-hot-toast";

const MyAccountPage = () => {
	const { user, logout } = useUserStore();
	const navigate = useNavigate();
	
	const [activeTab, setActiveTab] = useState("orders");
	const [orders, setOrders] = useState([]);
	const [loadingOrders, setLoadingOrders] = useState(true);
	const [selectedOrder, setSelectedOrder] = useState(null);
	
	const [profileData, setProfileData] = useState({
		name: "",
		email: "",
		currentPassword: "",
		newPassword: "",
		confirmPassword: ""
	});
	const [updatingProfile, setUpdatingProfile] = useState(false);

	useEffect(() => {
		if (user) {
			setProfileData(prev => ({
				...prev,
				name: user.name || "",
				email: user.email || ""
			}));
			fetchOrders();
		}
	}, [user]);

	const fetchOrders = async () => {
		try {
			setLoadingOrders(true);
			const res = await axios.get("/orders/my-orders");
			setOrders(res.data);
		} catch (error) {
			console.error("Error fetching orders:", error);
			toast.error("Failed to load orders");
		} finally {
			setLoadingOrders(false);
		}
	};

	const handleCancelOrder = async (orderId) => {
		if (!window.confirm("Are you sure you want to cancel this order?")) return;
		
		try {
			await axios.patch(`/orders/${orderId}/cancel`);
			toast.success("Order cancelled successfully");
			fetchOrders();
			setSelectedOrder(null);
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to cancel order");
		}
	};

	const getStatusColor = (status) => {
		switch (status) {
			case "pending": return "#f59e0b";
			case "processing": return "#3b82f6";
			case "shipped": return "#8b5cf6";
			case "delivered": return "#10b981";
			case "cancelled": return "#ef4444";
			default: return "#666";
		}
	};

	const getStatusIcon = (status) => {
		switch (status) {
			case "pending": return "fa-clock-o";
			case "processing": return "fa-cog fa-spin";
			case "shipped": return "fa-truck";
			case "delivered": return "fa-check-circle";
			case "cancelled": return "fa-times-circle";
			default: return "fa-question-circle";
		}
	};

	const formatDate = (date) => {
		return new Date(date).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	};

 	if (!user) {
		return (
			<div>
				<section className="breadcrumb-option">
					<div className="container">
						<div className="row">
							<div className="col-lg-12">
								<div className="breadcrumb__text">
									<h4>My Account</h4>
									<div className="breadcrumb__links">
										<Link to="/">Home</Link>
										<span>My Account</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				<section className="shop spad">
					<div className="container">
						<div style={{textAlign: 'center', padding: '80px 0'}}>
							<i className="fa fa-user-circle" style={{fontSize: '80px', color: '#e5e5e5', marginBottom: '20px', display: 'block'}}></i>
							<h3>Please login to view your account</h3>
							<p style={{color: '#6f6f6f', marginBottom: '30px'}}>
								Sign in to see your orders and manage your profile
							</p>
							<Link to="/login" className="primary-btn">Login</Link>
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
								<h4>My Account</h4>
								<div className="breadcrumb__links">
									<Link to="/">Home</Link>
									<span>My Account</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

 			<section className="shop spad">
				<div className="container">
					<div className="row">
 						<div className="col-lg-3 col-md-4">
							<div style={{
								background: '#fff',
								borderRadius: '12px',
								boxShadow: '0 2px 15px rgba(0,0,0,0.08)',
								overflow: 'hidden',
								marginBottom: '30px'
							}}>
 								<div style={{
									padding: '30px',
									background: 'linear-gradient(135deg, #111 0%, #333 100%)',
									color: '#fff',
									textAlign: 'center'
								}}>
									<div style={{
										width: '80px',
										height: '80px',
										borderRadius: '50%',
										background: '#e53637',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										margin: '0 auto 15px',
										fontSize: '32px',
										fontWeight: '700'
									}}>
										{user.name?.charAt(0).toUpperCase()}
									</div>
									<h5 style={{margin: '0 0 5px', fontSize: '18px', fontWeight: '700'}}>
										{user.name}
									</h5>
									<p style={{margin: 0, fontSize: '13px', opacity: 0.8}}>
										{user.email}
									</p>
								</div>

								
								<div style={{padding: '15px'}}>
									{[
										{ id: 'orders', icon: 'fa-shopping-bag', label: 'My Orders' },
										{ id: 'profile', icon: 'fa-user', label: 'Profile Settings' },
										{ id: 'coupons', icon: 'fa-ticket', label: 'My Coupons' },
										{ id: 'wishlist', icon: 'fa-heart', label: 'Wishlist' },
									].map(item => (
										<button
											key={item.id}
											onClick={() => {
												if (item.id === 'coupons') {
													navigate('/my-coupons');
												} else if (item.id === 'wishlist') {
													navigate('/wishlist');
												} else {
													setActiveTab(item.id);
												}
											}}
											style={{
												width: '100%',
												padding: '15px 20px',
												background: activeTab === item.id ? '#f5f5f5' : 'transparent',
												border: 'none',
												borderRadius: '8px',
												cursor: 'pointer',
												display: 'flex',
												alignItems: 'center',
												gap: '12px',
												fontSize: '14px',
												fontWeight: activeTab === item.id ? '600' : '400',
												color: activeTab === item.id ? '#e53637' : '#333',
												transition: 'all 0.3s',
												marginBottom: '5px'
											}}
										>
											<i className={`fa ${item.icon}`} style={{width: '20px'}}></i>
											{item.label}
										</button>
									))}

 									<button
										onClick={() => {
											logout();
											navigate('/');
										}}
										style={{
											width: '100%',
											padding: '15px 20px',
											background: 'transparent',
											border: 'none',
											borderRadius: '8px',
											cursor: 'pointer',
											display: 'flex',
											alignItems: 'center',
											gap: '12px',
											fontSize: '14px',
											color: '#ef4444',
											transition: 'all 0.3s',
											marginTop: '10px',
											borderTop: '1px solid #f0f0f0',
											paddingTop: '20px'
										}}
									>
										<i className="fa fa-sign-out" style={{width: '20px'}}></i>
										Logout
									</button>
								</div>
							</div>
						</div>

 						<div className="col-lg-9 col-md-8">
						
							{activeTab === 'orders' && (
								<div>
									<div style={{
										display: 'flex',
										justifyContent: 'space-between',
										alignItems: 'center',
										marginBottom: '30px'
									}}>
										<h3 style={{margin: 0, fontSize: '24px', fontWeight: '700'}}>
											<i className="fa fa-shopping-bag" style={{marginRight: '15px', color: '#e53637'}}></i>
											My Orders
										</h3>
										<span style={{color: '#666', fontSize: '14px'}}>
											{orders.length} order{orders.length !== 1 ? 's' : ''}
										</span>
									</div>

									{loadingOrders ? (
										<div style={{textAlign: 'center', padding: '60px 0'}}>
											<i className="fa fa-spinner fa-spin" style={{fontSize: '40px', color: '#e53637'}}></i>
											<p style={{marginTop: '20px', color: '#666'}}>Loading your orders...</p>
										</div>
									) : orders.length === 0 ? (
										<div style={{
											textAlign: 'center',
											padding: '80px 20px',
											background: '#f9f9f9',
											borderRadius: '12px'
										}}>
											<i className="fa fa-shopping-bag" style={{
												fontSize: '80px',
												color: '#ddd',
												marginBottom: '20px',
												display: 'block'
											}}></i>
											<h4 style={{color: '#333', marginBottom: '10px'}}>No orders yet</h4>
											<p style={{color: '#666', marginBottom: '30px'}}>
												Start shopping to see your orders here!
											</p>
											<Link to="/category/all" className="primary-btn">
												Start Shopping
											</Link>
										</div>
									) : (
										<div>
											{orders.map((order) => (
												<div
													key={order._id}
													style={{
														background: '#fff',
														borderRadius: '12px',
														boxShadow: '0 2px 15px rgba(0,0,0,0.08)',
														marginBottom: '20px',
														overflow: 'hidden'
													}}
												>
													<div style={{
														padding: '20px 25px',
														background: '#f9f9f9',
														borderBottom: '1px solid #f0f0f0',
														display: 'flex',
														justifyContent: 'space-between',
														alignItems: 'center',
														flexWrap: 'wrap',
														gap: '15px'
													}}>
														<div>
															<span style={{
																fontSize: '12px',
																color: '#999',
																display: 'block',
																marginBottom: '5px'
															}}>
																Order #{order.orderNumber || order._id.slice(-8).toUpperCase()}
															</span>
															<span style={{fontSize: '14px', color: '#666'}}>
																{formatDate(order.createdAt)}
															</span>
														</div>
 
														<div style={{
															display: 'flex',
															alignItems: 'center',
															gap: '8px',
															padding: '8px 16px',
															background: `${getStatusColor(order.status)}15`,
															color: getStatusColor(order.status),
															borderRadius: '20px',
															fontSize: '13px',
															fontWeight: '600',
															textTransform: 'capitalize'
														}}>
															<i className={`fa ${getStatusIcon(order.status)}`}></i>
															{order.status}
														</div>
													</div>
 
													<div style={{padding: '20px 25px'}}>
														{order.products.slice(0, 2).map((item, idx) => {
															const product = item.product || {};
															const image = item.image || product.images?.[0] || product.image || '/img/placeholder.jpg';
															
															return (
																<div
																	key={idx}
																	style={{
																		display: 'flex',
																		gap: '15px',
																		marginBottom: idx < order.products.length - 1 ? '15px' : 0,
																		paddingBottom: idx < order.products.length - 1 ? '15px' : 0,
																		borderBottom: idx < order.products.length - 1 ? '1px solid #f0f0f0' : 'none'
																	}}
																>
																	<img
																		src={image}
																		alt={item.name || product.name}
																		style={{
																			width: '70px',
																			height: '70px',
																			objectFit: 'cover',
																			borderRadius: '8px'
																		}}
																	/>
																	<div style={{flex: 1}}>
																		<h6 style={{
																			margin: '0 0 5px',
																			fontSize: '15px',
																			fontWeight: '600'
																		}}>
																			{item.name || product.name}
																		</h6>
																		<p style={{
																			margin: 0,
																			fontSize: '13px',
																			color: '#666'
																		}}>
																			Qty: {item.quantity}
																			{item.size && ` • Size: ${item.size}`}
																			{item.color && ` • Color: ${item.color}`}
																		</p>
																	</div>
																	<div style={{
																		fontWeight: '600',
																		color: '#111'
																	}}>
																		${(item.price * item.quantity).toFixed(2)}
																	</div>
																</div>
															);
														})}

														{order.products.length > 2 && (
															<p style={{
																margin: '15px 0 0',
																fontSize: '13px',
																color: '#666',
																fontStyle: 'italic'
															}}>
																+ {order.products.length - 2} more item{order.products.length - 2 > 1 ? 's' : ''}
															</p>
														)}
													</div>
 
													<div style={{
														padding: '15px 25px',
														background: '#f9f9f9',
														display: 'flex',
														justifyContent: 'space-between',
														alignItems: 'center',
														flexWrap: 'wrap',
														gap: '15px'
													}}>
														<div style={{
															fontSize: '18px',
															fontWeight: '700',
															color: '#111'
														}}>
															Total: <span style={{color: '#e53637'}}>${order.totalAmount.toFixed(2)}</span>
														</div>

														<div style={{display: 'flex', gap: '10px'}}>
															<button
																onClick={() => setSelectedOrder(order)}
																style={{
																	padding: '10px 20px',
																	background: '#111',
																	color: '#fff',
																	border: 'none',
																	borderRadius: '6px',
																	fontSize: '13px',
																	fontWeight: '600',
																	cursor: 'pointer',
																	transition: 'all 0.3s'
																}}
																onMouseEnter={(e) => e.target.style.background = '#333'}
																onMouseLeave={(e) => e.target.style.background = '#111'}
															>
																View Details
															</button>

															{order.status === 'pending' && (
																<button
																	onClick={() => handleCancelOrder(order._id)}
																	style={{
																		padding: '10px 20px',
																		background: 'transparent',
																		color: '#ef4444',
																		border: '1px solid #ef4444',
																		borderRadius: '6px',
																		fontSize: '13px',
																		fontWeight: '600',
																		cursor: 'pointer',
																		transition: 'all 0.3s'
																	}}
																>
																	Cancel
																</button>
															)}
														</div>
													</div>
												</div>
											))}
										</div>
									)}
								</div>
							)}
 
							{activeTab === 'profile' && (
								<div>
									<h3 style={{marginBottom: '30px', fontSize: '24px', fontWeight: '700'}}>
										<i className="fa fa-user" style={{marginRight: '15px', color: '#e53637'}}></i>
										Profile Settings
									</h3>

									<div style={{
										background: '#fff',
										borderRadius: '12px',
										boxShadow: '0 2px 15px rgba(0,0,0,0.08)',
										padding: '30px'
									}}>
										<form>
											<div style={{marginBottom: '25px'}}>
												<label style={{
													display: 'block',
													marginBottom: '10px',
													fontWeight: '600',
													color: '#333'
												}}>
													Full Name
												</label>
												<input
													type="text"
													value={profileData.name}
													onChange={(e) => setProfileData({...profileData, name: e.target.value})}
													style={{
														width: '100%',
														padding: '14px 18px',
														border: '1px solid #e5e5e5',
														borderRadius: '8px',
														fontSize: '15px',
														outline: 'none',
														transition: 'border-color 0.3s'
													}}
												/>
											</div>

 											<div style={{marginBottom: '25px'}}>
												<label style={{
													display: 'block',
													marginBottom: '10px',
													fontWeight: '600',
													color: '#333'
												}}>
													Email Address
												</label>
												<input
													type="email"
													value={profileData.email}
													disabled
													style={{
														width: '100%',
														padding: '14px 18px',
														border: '1px solid #e5e5e5',
														borderRadius: '8px',
														fontSize: '15px',
														background: '#f9f9f9',
														color: '#666'
													}}
												/>
												<small style={{color: '#999', fontSize: '12px'}}>
													Email cannot be changed
												</small>
											</div>

											<hr style={{margin: '30px 0', border: 'none', borderTop: '1px solid #f0f0f0'}} />

											<h5 style={{marginBottom: '20px', fontWeight: '600'}}>Change Password</h5>

 											<div style={{marginBottom: '25px'}}>
												<label style={{
													display: 'block',
													marginBottom: '10px',
													fontWeight: '600',
													color: '#333'
												}}>
													Current Password
												</label>
												<input
													type="password"
													value={profileData.currentPassword}
													onChange={(e) => setProfileData({...profileData, currentPassword: e.target.value})}
													placeholder="Enter current password"
													style={{
														width: '100%',
														padding: '14px 18px',
														border: '1px solid #e5e5e5',
														borderRadius: '8px',
														fontSize: '15px',
														outline: 'none'
													}}
												/>
											</div>
											<div className="row">
												<div className="col-md-6">
													<div style={{marginBottom: '25px'}}>
														<label style={{
															display: 'block',
															marginBottom: '10px',
															fontWeight: '600',
															color: '#333'
														}}>
															New Password
														</label>
														<input
															type="password"
															value={profileData.newPassword}
															onChange={(e) => setProfileData({...profileData, newPassword: e.target.value})}
															placeholder="Enter new password"
															style={{
																width: '100%',
																padding: '14px 18px',
																border: '1px solid #e5e5e5',
																borderRadius: '8px',
																fontSize: '15px',
																outline: 'none'
															}}
														/>
													</div>
												</div>
												<div className="col-md-6">
													<div style={{marginBottom: '25px'}}>
														<label style={{
															display: 'block',
															marginBottom: '10px',
															fontWeight: '600',
															color: '#333'
														}}>
															Confirm New Password
														</label>
														<input
															type="password"
															value={profileData.confirmPassword}
															onChange={(e) => setProfileData({...profileData, confirmPassword: e.target.value})}
															placeholder="Confirm new password"
															style={{
																width: '100%',
																padding: '14px 18px',
																border: '1px solid #e5e5e5',
																borderRadius: '8px',
																fontSize: '15px',
																outline: 'none'
															}}
														/>
													</div>
												</div>
											</div>

											<button
												type="submit"
												disabled={updatingProfile}
												className="primary-btn"
												style={{
													padding: '14px 40px',
													opacity: updatingProfile ? 0.7 : 1
												}}
											>
												{updatingProfile ? (
													<><i className="fa fa-spinner fa-spin"></i> Saving...</>
												) : (
													<><i className="fa fa-save" style={{marginRight: '8px'}}></i> Save Changes</>
												)}
											</button>
										</form>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</section>

			{selectedOrder && (
				<div style={{
					position: 'fixed',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					background: 'rgba(0,0,0,0.5)',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					zIndex: 9999,
					padding: '20px'
				}}
				onClick={() => setSelectedOrder(null)}
				>
					<div
						style={{
							background: '#fff',
							borderRadius: '12px',
							maxWidth: '700px',
							width: '100%',
							maxHeight: '90vh',
							overflow: 'auto'
						}}
						onClick={(e) => e.stopPropagation()}
					>
						<div style={{
							padding: '25px 30px',
							borderBottom: '1px solid #f0f0f0',
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							position: 'sticky',
							top: 0,
							background: '#fff',
							zIndex: 1
						}}>
							<div>
								<h4 style={{margin: '0 0 5px', fontSize: '20px', fontWeight: '700'}}>
									Order Details
								</h4>
								<span style={{fontSize: '14px', color: '#666'}}>
									#{selectedOrder.orderNumber || selectedOrder._id.slice(-8).toUpperCase()}
								</span>
							</div>
							<button
								onClick={() => setSelectedOrder(null)}
								style={{
									background: 'none',
									border: 'none',
									fontSize: '24px',
									cursor: 'pointer',
									color: '#999'
								}}
							>
								<i className="fa fa-times"></i>
							</button>
						</div>

						<div style={{padding: '30px'}}>
							<div style={{
								display: 'flex',
								alignItems: 'center',
								gap: '10px',
								marginBottom: '25px'
							}}>
								<span style={{fontWeight: '600'}}>Status:</span>
								<span style={{
									padding: '6px 14px',
									background: `${getStatusColor(selectedOrder.status)}15`,
									color: getStatusColor(selectedOrder.status),
									borderRadius: '20px',
									fontSize: '13px',
									fontWeight: '600',
									textTransform: 'capitalize'
								}}>
									<i className={`fa ${getStatusIcon(selectedOrder.status)}`} style={{marginRight: '6px'}}></i>
									{selectedOrder.status}
								</span>
							</div>

							<div className="row" style={{marginBottom: '25px'}}>
								<div className="col-6">
									<p style={{margin: '0 0 5px', color: '#999', fontSize: '12px'}}>ORDER DATE</p>
									<p style={{margin: 0, fontWeight: '600'}}>{formatDate(selectedOrder.createdAt)}</p>
								</div>
								<div className="col-6">
									<p style={{margin: '0 0 5px', color: '#999', fontSize: '12px'}}>PAYMENT</p>
									<p style={{margin: 0, fontWeight: '600', textTransform: 'capitalize'}}>
										{selectedOrder.paymentStatus || 'Paid'}
									</p>
								</div>
							</div>

							{selectedOrder.shippingAddress && (
								<div style={{
									background: '#f9f9f9',
									padding: '20px',
									borderRadius: '8px',
									marginBottom: '25px'
								}}>
									<h6 style={{margin: '0 0 10px', fontWeight: '600'}}>
										<i className="fa fa-map-marker" style={{marginRight: '8px', color: '#e53637'}}></i>
										Shipping Address
									</h6>
									<p style={{margin: 0, color: '#666', lineHeight: '1.6'}}>
										{selectedOrder.shippingAddress.fullName}<br />
										{selectedOrder.shippingAddress.address}<br />
										{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.postalCode}<br />
										{selectedOrder.shippingAddress.country}
										{selectedOrder.shippingAddress.phone && (
											<><br />Phone: {selectedOrder.shippingAddress.phone}</>
										)}
									</p>
								</div>
							)}

							<h6 style={{margin: '0 0 15px', fontWeight: '600'}}>
								<i className="fa fa-shopping-bag" style={{marginRight: '8px', color: '#e53637'}}></i>
								Items ({selectedOrder.products.length})
							</h6>
							
							{selectedOrder.products.map((item, idx) => {
								const product = item.product || {};
								const image = item.image || product.images?.[0] || product.image || '/img/placeholder.jpg';
								
								return (
									<div
										key={idx}
										style={{
											display: 'flex',
											gap: '15px',
											padding: '15px 0',
											borderBottom: idx < selectedOrder.products.length - 1 ? '1px solid #f0f0f0' : 'none'
										}}
									>
										<img
											src={image}
											alt={item.name || product.name}
											style={{
												width: '80px',
												height: '80px',
												objectFit: 'cover',
												borderRadius: '8px'
											}}
										/>
										<div style={{flex: 1}}>
											<h6 style={{margin: '0 0 5px', fontSize: '15px', fontWeight: '600'}}>
												{item.name || product.name}
											</h6>
											<p style={{margin: '0 0 5px', fontSize: '13px', color: '#666'}}>
												Quantity: {item.quantity}
												{item.size && ` • Size: ${item.size}`}
												{item.color && ` • Color: ${item.color}`}
											</p>
											<p style={{margin: 0, fontWeight: '600'}}>
												${item.price.toFixed(2)} each
											</p>
										</div>
										<div style={{fontWeight: '700', fontSize: '16px'}}>
											${(item.price * item.quantity).toFixed(2)}
										</div>
									</div>
								);
							})}

							<div style={{
								marginTop: '25px',
								paddingTop: '20px',
								borderTop: '2px solid #f0f0f0'
							}}>
								<div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '10px'}}>
									<span style={{color: '#666'}}>Subtotal</span>
									<span>${(selectedOrder.subtotal || selectedOrder.totalAmount).toFixed(2)}</span>
								</div>
								{selectedOrder.shippingCost > 0 && (
									<div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '10px'}}>
										<span style={{color: '#666'}}>Shipping</span>
										<span>${selectedOrder.shippingCost.toFixed(2)}</span>
									</div>
								)}
								{selectedOrder.discount > 0 && (
									<div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '10px'}}>
										<span style={{color: '#10b981'}}>Discount</span>
										<span style={{color: '#10b981'}}>-${selectedOrder.discount.toFixed(2)}</span>
									</div>
								)}
								<div style={{
									display: 'flex',
									justifyContent: 'space-between',
									paddingTop: '15px',
									borderTop: '1px solid #f0f0f0',
									fontSize: '20px',
									fontWeight: '700'
								}}>
									<span>Total</span>
									<span style={{color: '#e53637'}}>${selectedOrder.totalAmount.toFixed(2)}</span>
								</div>
							</div>

							{selectedOrder.status === 'pending' && (
								<button
									onClick={() => handleCancelOrder(selectedOrder._id)}
									style={{
										width: '100%',
										padding: '14px',
										background: 'transparent',
										color: '#ef4444',
										border: '1px solid #ef4444',
										borderRadius: '8px',
										fontSize: '15px',
										fontWeight: '600',
										cursor: 'pointer',
										marginTop: '25px',
										transition: 'all 0.3s'
									}}
								>
									<i className="fa fa-times" style={{marginRight: '8px'}}></i>
									Cancel Order
								</button>
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default MyAccountPage;