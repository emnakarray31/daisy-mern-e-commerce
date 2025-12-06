import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "../stores/useCartStore";
import { useState } from "react";

const CartPage = () => {
	const navigate = useNavigate();
	const { cart, removeFromCart, updateQuantity, total, subtotal, coupon, isCouponApplied, applyCoupon, removeCoupon } = useCartStore();
	const [couponCode, setCouponCode] = useState("");
	const [applyingCoupon, setApplyingCoupon] = useState(false);

	const savings = subtotal - total;
	const formattedSubtotal = subtotal.toFixed(2);
	const formattedTotal = total.toFixed(2);
	const formattedSavings = savings.toFixed(2);

	const handleApplyCoupon = async () => {
		if (!couponCode.trim()) return;
		setApplyingCoupon(true);
		await applyCoupon(couponCode);
		setApplyingCoupon(false);
		setCouponCode("");
	};

	const handleRemoveCoupon = async () => {
		await removeCoupon();
	};

	const handleCheckout = () => {
		navigate('/checkout');
	};

	return (
		<div className="shopping-cart spad">
			<div className="container">
				<div className="row">
					<div className="col-lg-12">
						<div className="shopping__cart__table">
							{cart.length === 0 ? (
								<div style={{textAlign: 'center', padding: '80px 0'}}>
									<i className="fa fa-shopping-cart" style={{fontSize: '80px', color: '#e5e5e5', marginBottom: '20px'}}></i>
									<h3>Your cart is empty</h3>
									<p style={{color: '#6f6f6f', marginBottom: '30px'}}>Looks like you haven't added anything to your cart yet.</p>
									<Link to="/" className="primary-btn">
										Start Shopping
									</Link>
								</div>
							) : (
								<>
									<table>
										<thead>
											<tr>
												<th>Product</th>
												<th>Price</th>
												<th>Quantity</th>
												<th>Total</th>
												<th></th>
											</tr>
										</thead>
										<tbody>
											{cart.map((item) => (
												<tr key={item._id}>
													<td className="product__cart__item">
														<div className="product__cart__item__pic">
															<img 
																src={item.image} 
																alt={item.name}
																style={{
																	width: '90px',
																	height: '90px',
																	objectFit: 'cover'
																}}
															/>
														</div>
														<div className="product__cart__item__text">
															<h6>{item.name}</h6>
															{item.selectedSize && (
																<p style={{fontSize: '12px', color: '#999', marginTop: '5px'}}>
																	Size: {item.selectedSize}
																</p>
															)}
															{item.selectedColor && (
																<p style={{fontSize: '12px', color: '#999', marginTop: '3px'}}>
																	Color: {item.selectedColor}
																</p>
															)}
														</div>
													</td>
													<td className="cart__price">${item.price.toFixed(2)}</td>
													<td className="cart__quantity">
														<div className="pro-qty">
															<button
																onClick={() => updateQuantity(item._id, item.quantity - 1)}
																style={{
																	background: 'none',
																	border: 'none',
																	cursor: 'pointer',
																	fontSize: '16px',
																	padding: '5px 10px'
																}}
															>
																<i className="fa fa-angle-down"></i>
															</button>
															<input 
																type="text" 
																value={item.quantity}
																readOnly
																style={{
																	width: '50px',
																	textAlign: 'center',
																	border: '1px solid #e5e5e5',
																	padding: '5px'
																}}
															/>
															<button
																onClick={() => updateQuantity(item._id, item.quantity + 1)}
																style={{
																	background: 'none',
																	border: 'none',
																	cursor: 'pointer',
																	fontSize: '16px',
																	padding: '5px 10px'
																}}
															>
																<i className="fa fa-angle-up"></i>
															</button>
														</div>
													</td>
													<td className="cart__total">${(item.price * item.quantity).toFixed(2)}</td>
													<td className="cart__close">
														<button
															onClick={() => removeFromCart(item._id)}
															style={{
																background: 'none',
																border: 'none',
																cursor: 'pointer',
																color: '#6f6f6f',
																fontSize: '18px'
															}}
														>
															<i className="fa fa-times"></i>
														</button>
													</td>
												</tr>
											))}
										</tbody>
									</table>

									<div className="row">
										<div className="col-lg-6 col-md-6 col-sm-6">
											<div className="continue__btn">
												<Link to="/">Continue Shopping</Link>
											</div>
										</div>
										<div className="col-lg-6 col-md-6 col-sm-6">
											<div className="continue__btn update__btn">
												<button onClick={() => window.location.reload()}>
													<i className="fa fa-refresh"></i> Update cart
												</button>
											</div>
										</div>
									</div>

									<div className="row" style={{marginTop: '50px'}}>
										{/* Coupon Section */}
										<div className="col-lg-6">
											<div style={{
												background: '#f9f9f9',
												padding: '30px',
												borderRadius: '8px'
											}}>
												<h6 style={{
													fontSize: '16px',
													fontWeight: '700',
													textTransform: 'uppercase',
													marginBottom: '20px',
													letterSpacing: '1px'
												}}>
													Discount Code
												</h6>
												
												{!isCouponApplied ? (
													<div style={{position: 'relative'}}>
														<input 
															type="text" 
															placeholder="Enter your coupon code"
															value={couponCode}
															onChange={(e) => setCouponCode(e.target.value)}
															style={{
																width: '100%',
																padding: '15px 120px 15px 20px',
																border: '1px solid #e5e5e5',
																borderRadius: '4px',
																fontSize: '14px',
																outline: 'none',
																transition: 'all 0.3s'
															}}
															onFocus={(e) => e.target.style.borderColor = '#111'}
															onBlur={(e) => e.target.style.borderColor = '#e5e5e5'}
														/>
														<button 
															onClick={handleApplyCoupon}
															disabled={applyingCoupon}
															style={{
																position: 'absolute',
																right: '5px',
																top: '5px',
																bottom: '5px',
																padding: '0 25px',
																background: '#2d2d2d',
																color: '#fff',
																border: 'none',
																borderRadius: '4px',
																fontSize: '13px',
																fontWeight: '700',
																textTransform: 'uppercase',
																letterSpacing: '1px',
																cursor: applyingCoupon ? 'not-allowed' : 'pointer',
																transition: 'all 0.3s'
															}}
															onMouseEnter={(e) => {
																if (!applyingCoupon) e.target.style.background = '#111';
															}}
															onMouseLeave={(e) => {
																if (!applyingCoupon) e.target.style.background = '#2d2d2d';
															}}
														>
															{applyingCoupon ? 'Applying...' : 'Apply'}
														</button>
													</div>
												) : (
													<div style={{
														padding: '20px',
														background: '#f0fdf4',
														border: '2px solid #86efac',
														borderRadius: '8px'
													}}>
														<div style={{
															display: 'flex',
															justifyContent: 'space-between',
															alignItems: 'center'
														}}>
															<div>
																<p style={{
																	margin: 0,
																	fontSize: '15px',
																	fontWeight: '700',
																	color: '#16a34a',
																	textTransform: 'uppercase',
																	letterSpacing: '0.5px'
																}}>
																	<i className="fa fa-check-circle" style={{marginRight: '10px'}}></i>
																	Coupon Applied!
																</p>
																<p style={{
																	margin: '8px 0 0 0',
																	fontSize: '14px',
																	color: '#15803d'
																}}>
																	Code: <strong>{coupon.code}</strong> - Save {coupon.discountPercentage}%
																</p>
															</div>
															<button
																onClick={handleRemoveCoupon}
																style={{
																	background: '#dc2626',
																	color: '#fff',
																	border: 'none',
																	width: '35px',
																	height: '35px',
																	borderRadius: '50%',
																	cursor: 'pointer',
																	fontSize: '16px',
																	transition: 'all 0.3s'
																}}
																onMouseEnter={(e) => e.target.style.background = '#b91c1c'}
																onMouseLeave={(e) => e.target.style.background = '#dc2626'}
															>
																<i className="fa fa-times"></i>
															</button>
														</div>
													</div>
												)}
											</div>
										</div>
 
										<div className="col-lg-6">
											<div style={{
												background: '#fff',
												border: '2px solid #f0f0f0',
												padding: '30px',
												borderRadius: '8px'
											}}>
												<h6 style={{
													fontSize: '18px',
													fontWeight: '700',
													textTransform: 'uppercase',
													marginBottom: '25px',
													letterSpacing: '1px',
													paddingBottom: '15px',
													borderBottom: '2px solid #f0f0f0'
												}}>
													Cart Total
												</h6>
												
												<div style={{marginBottom: '30px'}}>
													
													<div style={{
														display: 'flex',
														justifyContent: 'space-between',
														alignItems: 'center',
														marginBottom: '15px',
														padding: '12px 0',
														borderBottom: '1px solid #f5f5f5'
													}}>
														<span style={{fontSize: '14px', color: '#666', fontWeight: '600'}}>Subtotal</span>
														<span style={{fontSize: '16px', color: '#111', fontWeight: '700'}}>${formattedSubtotal}</span>
													</div>
 
													{savings > 0 && (
														<div style={{
															display: 'flex',
															justifyContent: 'space-between',
															alignItems: 'center',
															marginBottom: '15px',
															padding: '12px 0',
															borderBottom: '1px solid #f5f5f5'
														}}>
															<span style={{fontSize: '14px', color: '#10b981', fontWeight: '600'}}>Savings</span>
															<span style={{fontSize: '16px', color: '#10b981', fontWeight: '700'}}>-${formattedSavings}</span>
														</div>
													)}
 
													{coupon && isCouponApplied && (
														<div style={{
															display: 'flex',
															justifyContent: 'space-between',
															alignItems: 'center',
															marginBottom: '15px',
															padding: '12px 0',
															borderBottom: '1px solid #f5f5f5'
														}}>
															<span style={{fontSize: '14px', color: '#10b981', fontWeight: '600'}}>
																Coupon ({coupon.code})
															</span>
															<span style={{fontSize: '16px', color: '#10b981', fontWeight: '700'}}>
																-{coupon.discountPercentage}%
															</span>
														</div>
													)}
 
													<div style={{
														display: 'flex',
														justifyContent: 'space-between',
														alignItems: 'center',
														marginTop: '20px',
														padding: '20px 0 0 0',
														borderTop: '2px solid #2d2d2d'
													}}>
														<span style={{fontSize: '18px', color: '#111', fontWeight: '700', textTransform: 'uppercase'}}>
															Total
														</span>
														<span style={{fontSize: '24px', color: '#e53637', fontWeight: '700'}}>
															${formattedTotal}
														</span>
													</div>
												</div>

												<button 
													onClick={handleCheckout}
													style={{
														width: '100%',
														padding: '16px',
														background: '#2d2d2d',
														color: '#fff',
														border: 'none',
														borderRadius: '4px',
														fontSize: '14px',
														fontWeight: '700',
														textTransform: 'uppercase',
														letterSpacing: '1px',
														cursor: 'pointer',
														transition: 'all 0.3s',
														display: 'flex',
														alignItems: 'center',
														justifyContent: 'center',
														gap: '10px'
													}}
													onMouseEnter={(e) => e.target.style.background = '#111'}
													onMouseLeave={(e) => e.target.style.background = '#2d2d2d'}
												>
													Proceed to Checkout
													<i className="fa fa-arrow-right"></i>
												</button>
											</div>
										</div>
									</div>
								</>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CartPage;