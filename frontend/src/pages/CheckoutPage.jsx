 import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../stores/useCartStore";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "../lib/axios";
import toast from "react-hot-toast";

const countries = [
	"United States", "Canada", "United Kingdom", "France", "Germany", "Italy", "Spain",
	"Australia", "Japan", "China", "India", "Brazil", "Mexico", "South Africa", "Tunisia"
];

const CARD_ELEMENT_OPTIONS = {
	style: {
		base: {
			fontSize: '16px',
			color: '#111',
			fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
			'::placeholder': {
				color: '#999',
			},
		},
		invalid: {
			color: '#e53637',
			iconColor: '#e53637'
		}
	},
	hidePostalCode: true
};

const CheckoutPage = () => {
	const stripe = useStripe();
	const elements = useElements();
	const navigate = useNavigate();
	const { cart, total, subtotal, coupon, clearCart } = useCartStore();
	
	const [shippingInfo, setShippingInfo] = useState({
		firstName: "",
		lastName: "",
		email: "",
		phone: "",
		address: "",
		city: "",
		postalCode: "",
		country: ""
	});
	
	const [processing, setProcessing] = useState(false);
	const [cardError, setCardError] = useState("");

	const savings = subtotal - total;
	const shippingCost = total > 100 ? 0 : 10;
	const finalTotal = total + shippingCost;

	const handleShippingChange = (e) => {
		setShippingInfo({
			...shippingInfo,
			[e.target.name]: e.target.value
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		
		if (cart.length === 0) {
			toast.error("Your cart is empty!");
			navigate('/cart');
			return;
		}

		if (!stripe || !elements) {
			toast.error("Stripe has not loaded yet. Please try again.");
			return;
		}

		setProcessing(true);
		setCardError("");

		 
		
		try {
			 
			const { data } = await axios.post("/payments/create-payment-intent", {
				amount: Math.round(finalTotal * 100), 
				products: cart,
				couponCode: coupon ? coupon.code : null,
				shippingInfo: shippingInfo
			});

			const { clientSecret, paymentIntentId } = data;

		 
			const result = await stripe.confirmCardPayment(clientSecret, {
				payment_method: {
					card: elements.getElement(CardElement),
					billing_details: {
						name: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
						email: shippingInfo.email,
						phone: shippingInfo.phone,
						address: {
							line1: shippingInfo.address,
							city: shippingInfo.city,
							postal_code: shippingInfo.postalCode,
							country: shippingInfo.country === "United States" ? "US" : "TN"
						}
					}
				}
			});

			if (result.error) {
				 
				setCardError(result.error.message);
				toast.error(result.error.message);
				setProcessing(false);
			} else {
				 
				if (result.paymentIntent.status === 'succeeded') {
					  
					try {
						await axios.post("/payments/confirm-payment", {
						paymentIntentId: paymentIntentId,
						shippingAddress: {
							firstName: shippingInfo.firstName,
							lastName: shippingInfo.lastName,
							street: shippingInfo.address,
							city: shippingInfo.city,
							zipCode: shippingInfo.postalCode,
							country: shippingInfo.country,
							phone: shippingInfo.phone,
							email: shippingInfo.email,
						},
						subtotal: subtotal,
						discount: coupon ? (subtotal * coupon.discountPercentage / 100) : 0,
						shippingCost: shippingCost,
						total: finalTotal,
						couponCode: coupon?.code || null,
					});
					} catch (confirmError) {
						console.error("Error confirming payment:", confirmError);
					}

					toast.success("Payment successful!");
					clearCart();
					navigate('/purchase-success');
				}
			}
		} catch (error) {
			console.error("Payment error:", error);
			toast.error(error.response?.data?.message || "Payment failed. Please try again.");
			setProcessing(false);
		}
	};

	if (cart.length === 0) {
		return (
			<div className="container" style={{padding: '100px 0', textAlign: 'center'}}>
				<i className="fa fa-shopping-cart" style={{fontSize: '80px', color: '#e5e5e5', marginBottom: '20px'}}></i>
				<h3>Your cart is empty</h3>
				<p style={{color: '#6f6f6f', marginBottom: '30px'}}>Please add items to your cart before checkout.</p>
				<button 
					onClick={() => navigate('/')}
					className="primary-btn"
				>
					Continue Shopping
				</button>
			</div>
		);
	}

	return (
		<section className="checkout spad">
			<div className="container">
				<div style={{
					background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
					color: '#fff',
					padding: '20px 30px',
					borderRadius: '8px',
					marginBottom: '30px',
					boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
				}}>
					<h6 style={{
						fontSize: '16px',
						fontWeight: '700',
						marginBottom: '12px',
						textTransform: 'uppercase',
						letterSpacing: '1px'
					}}>
						🧪 Test Mode - Use These Cards:
					</h6>
					<div style={{
						display: 'grid',
						gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
						gap: '15px',
						fontSize: '14px'
					}}>
						<div>
							<strong>✅ Success:</strong> 4242 4242 4242 4242
						</div>
						<div>
							<strong>❌ Decline:</strong> 4000 0000 0000 0002
						</div>
						<div>
							<strong>⚠️ Auth Required:</strong> 4000 0025 0000 3155
						</div>
					</div>
					<p style={{
						fontSize: '12px',
						marginTop: '12px',
						marginBottom: 0,
						opacity: 0.9
					}}>
						Use any future expiry date (e.g., 12/34) and any 3-digit CVV
					</p>
				</div>

				<form onSubmit={handleSubmit}>
					<div className="row">
					
						<div className="col-lg-8">
							<div style={{
								background: '#fff',
								border: '2px solid #f0f0f0',
								padding: '40px',
								borderRadius: '8px',
								marginBottom: '30px'
							}}>
								<h4 style={{
									fontSize: '20px',
									fontWeight: '700',
									marginBottom: '30px',
									textTransform: 'uppercase',
									letterSpacing: '1px',
									paddingBottom: '15px',
									borderBottom: '2px solid #f0f0f0'
								}}>
									<i className="fa fa-user" style={{marginRight: '10px', color: '#e53637'}}></i>
									Billing Details
								</h4>

								<div className="row">
									<div className="col-lg-6">
										<div style={{marginBottom: '20px'}}>
											<label style={{
												display: 'block',
												fontSize: '13px',
												fontWeight: '700',
												color: '#111',
												marginBottom: '8px',
												textTransform: 'uppercase',
												letterSpacing: '0.5px'
											}}>
												First Name <span style={{color: '#e53637'}}>*</span>
											</label>
											<input 
												type="text"
												name="firstName"
												value={shippingInfo.firstName}
												onChange={handleShippingChange}
												required
												style={{
													width: '100%',
													padding: '14px 15px',
													border: '1px solid #e5e5e5',
													borderRadius: '4px',
													fontSize: '14px',
													outline: 'none',
													transition: 'all 0.3s'
												}}
												onFocus={(e) => e.target.style.borderColor = '#111'}
												onBlur={(e) => e.target.style.borderColor = '#e5e5e5'}
											/>
										</div>
									</div>
									<div className="col-lg-6">
										<div style={{marginBottom: '20px'}}>
											<label style={{
												display: 'block',
												fontSize: '13px',
												fontWeight: '700',
												color: '#111',
												marginBottom: '8px',
												textTransform: 'uppercase',
												letterSpacing: '0.5px'
											}}>
												Last Name <span style={{color: '#e53637'}}>*</span>
											</label>
											<input 
												type="text"
												name="lastName"
												value={shippingInfo.lastName}
												onChange={handleShippingChange}
												required
												style={{
													width: '100%',
													padding: '14px 15px',
													border: '1px solid #e5e5e5',
													borderRadius: '4px',
													fontSize: '14px',
													outline: 'none',
													transition: 'all 0.3s'
												}}
												onFocus={(e) => e.target.style.borderColor = '#111'}
												onBlur={(e) => e.target.style.borderColor = '#e5e5e5'}
											/>
										</div>
									</div>
								</div>

								<div className="row">
									<div className="col-lg-6">
										<div style={{marginBottom: '20px'}}>
											<label style={{
												display: 'block',
												fontSize: '13px',
												fontWeight: '700',
												color: '#111',
												marginBottom: '8px',
												textTransform: 'uppercase',
												letterSpacing: '0.5px'
											}}>
												Phone <span style={{color: '#e53637'}}>*</span>
											</label>
											<input 
												type="tel"
												name="phone"
												value={shippingInfo.phone}
												onChange={handleShippingChange}
												required
												style={{
													width: '100%',
													padding: '14px 15px',
													border: '1px solid #e5e5e5',
													borderRadius: '4px',
													fontSize: '14px',
													outline: 'none',
													transition: 'all 0.3s'
												}}
												onFocus={(e) => e.target.style.borderColor = '#111'}
												onBlur={(e) => e.target.style.borderColor = '#e5e5e5'}
											/>
										</div>
									</div>
									<div className="col-lg-6">
										<div style={{marginBottom: '20px'}}>
											<label style={{
												display: 'block',
												fontSize: '13px',
												fontWeight: '700',
												color: '#111',
												marginBottom: '8px',
												textTransform: 'uppercase',
												letterSpacing: '0.5px'
											}}>
												Email <span style={{color: '#e53637'}}>*</span>
											</label>
											<input 
												type="email"
												name="email"
												value={shippingInfo.email}
												onChange={handleShippingChange}
												required
												style={{
													width: '100%',
													padding: '14px 15px',
													border: '1px solid #e5e5e5',
													borderRadius: '4px',
													fontSize: '14px',
													outline: 'none',
													transition: 'all 0.3s'
												}}
												onFocus={(e) => e.target.style.borderColor = '#111'}
												onBlur={(e) => e.target.style.borderColor = '#e5e5e5'}
											/>
										</div>
									</div>
								</div>

								<div style={{marginBottom: '20px'}}>
									<label style={{
										display: 'block',
										fontSize: '13px',
										fontWeight: '700',
										color: '#111',
										marginBottom: '8px',
										textTransform: 'uppercase',
										letterSpacing: '0.5px'
									}}>
										Address <span style={{color: '#e53637'}}>*</span>
									</label>
									<input 
										type="text"
										name="address"
										value={shippingInfo.address}
										onChange={handleShippingChange}
										required
										style={{
											width: '100%',
											padding: '14px 15px',
											border: '1px solid #e5e5e5',
											borderRadius: '4px',
											fontSize: '14px',
											outline: 'none',
											transition: 'all 0.3s'
										}}
										onFocus={(e) => e.target.style.borderColor = '#111'}
										onBlur={(e) => e.target.style.borderColor = '#e5e5e5'}
									/>
								</div>

								<div className="row">
									<div className="col-lg-6">
										<div style={{marginBottom: '20px'}}>
											<label style={{
												display: 'block',
												fontSize: '13px',
												fontWeight: '700',
												color: '#111',
												marginBottom: '8px',
												textTransform: 'uppercase',
												letterSpacing: '0.5px'
											}}>
												City <span style={{color: '#e53637'}}>*</span>
											</label>
											<input 
												type="text"
												name="city"
												value={shippingInfo.city}
												onChange={handleShippingChange}
												required
												style={{
													width: '100%',
													padding: '14px 15px',
													border: '1px solid #e5e5e5',
													borderRadius: '4px',
													fontSize: '14px',
													outline: 'none',
													transition: 'all 0.3s'
												}}
												onFocus={(e) => e.target.style.borderColor = '#111'}
												onBlur={(e) => e.target.style.borderColor = '#e5e5e5'}
											/>
										</div>
									</div>
									<div className="col-lg-6">
										<div style={{marginBottom: '20px'}}>
											<label style={{
												display: 'block',
												fontSize: '13px',
												fontWeight: '700',
												color: '#111',
												marginBottom: '8px',
												textTransform: 'uppercase',
												letterSpacing: '0.5px'
											}}>
												Postal Code <span style={{color: '#e53637'}}>*</span>
											</label>
											<input 
												type="text"
												name="postalCode"
												value={shippingInfo.postalCode}
												onChange={handleShippingChange}
												required
												style={{
													width: '100%',
													padding: '14px 15px',
													border: '1px solid #e5e5e5',
													borderRadius: '4px',
													fontSize: '14px',
													outline: 'none',
													transition: 'all 0.3s'
												}}
												onFocus={(e) => e.target.style.borderColor = '#111'}
												onBlur={(e) => e.target.style.borderColor = '#e5e5e5'}
											/>
										</div>
									</div>
								</div>

								<div style={{marginBottom: '20px'}}>
									<label style={{
										display: 'block',
										fontSize: '13px',
										fontWeight: '700',
										color: '#111',
										marginBottom: '8px',
										textTransform: 'uppercase',
										letterSpacing: '0.5px'
									}}>
										Country <span style={{color: '#e53637'}}>*</span>
									</label>
									<select 
										name="country"
										value={shippingInfo.country}
										onChange={handleShippingChange}
										required
										style={{
											width: '100%',
											padding: '14px 15px',
											border: '1px solid #e5e5e5',
											borderRadius: '4px',
											fontSize: '14px',
											outline: 'none',
											transition: 'all 0.3s',
											cursor: 'pointer'
										}}
										onFocus={(e) => e.target.style.borderColor = '#111'}
										onBlur={(e) => e.target.style.borderColor = '#e5e5e5'}
									>
										<option value="">Select a country</option>
										{countries.map((country) => (
											<option key={country} value={country}>
												{country}
											</option>
										))}
									</select>
								</div>
							</div>
							<div style={{
								background: '#fff',
								border: '2px solid #f0f0f0',
								padding: '40px',
								borderRadius: '8px'
							}}>
								<div style={{
									display: 'flex',
									justifyContent: 'space-between',
									alignItems: 'center',
									marginBottom: '30px',
									paddingBottom: '15px',
									borderBottom: '2px solid #f0f0f0'
								}}>
									<h4 style={{
										fontSize: '20px',
										fontWeight: '700',
										textTransform: 'uppercase',
										letterSpacing: '1px',
										margin: 0
									}}>
										<i className="fa fa-credit-card" style={{marginRight: '10px', color: '#e53637'}}></i>
										Payment Information
									</h4>
									<div style={{display: 'flex', gap: '10px'}}>
										<img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" alt="Visa" style={{height: '25px'}} />
										<img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" style={{height: '25px'}} />
										<img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg" alt="Amex" style={{height: '25px'}} />
									</div>
								</div>

								<div style={{marginBottom: '20px'}}>
									<label style={{
										display: 'block',
										fontSize: '13px',
										fontWeight: '700',
										color: '#111',
										marginBottom: '8px',
										textTransform: 'uppercase',
										letterSpacing: '0.5px'
									}}>
										Card Details <span style={{color: '#e53637'}}>*</span>
									</label>
									<div style={{
										padding: '14px 15px',
										border: '1px solid #e5e5e5',
										borderRadius: '4px',
										background: '#fff'
									}}>
										<CardElement options={CARD_ELEMENT_OPTIONS} />
									</div>
									{cardError && (
										<p style={{
											color: '#e53637',
											fontSize: '13px',
											marginTop: '8px',
											marginBottom: 0
										}}>
											<i className="fa fa-exclamation-circle" style={{marginRight: '5px'}}></i>
											{cardError}
										</p>
									)}
								</div>

								<div style={{
									background: '#f9f9f9',
									padding: '15px',
									borderRadius: '6px',
									fontSize: '12px',
									color: '#666',
									display: 'flex',
									alignItems: 'center',
									gap: '10px'
								}}>
									<i className="fa fa-shield" style={{color: '#10b981', fontSize: '20px'}}></i>
									<span>Your payment information is encrypted and secure with Stripe</span>
								</div>
							</div>
						</div>
 
						<div className="col-lg-4">
							<div style={{
								background: '#fff',
								border: '2px solid #f0f0f0',
								padding: '30px',
								borderRadius: '8px',
								position: 'sticky',
								top: '20px'
							}}>
								<h4 style={{
									fontSize: '18px',
									fontWeight: '700',
									marginBottom: '25px',
									textTransform: 'uppercase',
									letterSpacing: '1px',
									paddingBottom: '15px',
									borderBottom: '2px solid #f0f0f0'
								}}>
									Order Summary
								</h4>

								<div style={{marginBottom: '20px', maxHeight: '300px', overflowY: 'auto'}}>
									{cart.map((item) => (
										<div key={item._id} style={{
											display: 'flex',
											gap: '12px',
											marginBottom: '15px',
											paddingBottom: '15px',
											borderBottom: '1px solid #f5f5f5'
										}}>
											<img 
												src={item.image} 
												alt={item.name}
												style={{
													width: '60px',
													height: '60px',
													objectFit: 'cover',
													borderRadius: '4px'
												}}
											/>
											<div style={{flex: 1}}>
												<p style={{margin: 0, fontSize: '13px', fontWeight: '600', marginBottom: '5px'}}>
													{item.name}
												</p>
												<p style={{margin: 0, fontSize: '12px', color: '#999'}}>
													Qty: {item.quantity}
													{item.selectedSize && ` | ${item.selectedSize}`}
												</p>
												<p style={{margin: '5px 0 0 0', fontSize: '14px', fontWeight: '700', color: '#e53637'}}>
													${(item.price * item.quantity).toFixed(2)}
												</p>
											</div>
										</div>
									))}
								</div>

								<div style={{marginBottom: '25px'}}>
									<div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px'}}>
										<span style={{color: '#666'}}>Subtotal</span>
										<span style={{fontWeight: '700'}}>${subtotal.toFixed(2)}</span>
									</div>
									{savings > 0 && (
										<div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px'}}>
											<span style={{color: '#10b981'}}>Savings</span>
											<span style={{fontWeight: '700', color: '#10b981'}}>-${savings.toFixed(2)}</span>
										</div>
									)}
									{coupon && (
										<div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px'}}>
											<span style={{color: '#10b981'}}>Coupon ({coupon.code})</span>
											<span style={{fontWeight: '700', color: '#10b981'}}>-{coupon.discountPercentage}%</span>
										</div>
									)}
									<div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px'}}>
										<span style={{color: '#666'}}>Shipping</span>
										<span style={{fontWeight: '700', color: shippingCost === 0 ? '#10b981' : '#111'}}>
											{shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
										</span>
									</div>
									<div style={{
										display: 'flex',
										justifyContent: 'space-between',
										paddingTop: '15px',
										marginTop: '15px',
										borderTop: '2px solid #2d2d2d',
										fontSize: '18px'
									}}>
										<span style={{fontWeight: '700', textTransform: 'uppercase'}}>Total</span>
										<span style={{fontWeight: '700', color: '#e53637', fontSize: '22px'}}>${finalTotal.toFixed(2)}</span>
									</div>
								</div>

								<button 
									type="submit"
									disabled={processing || !stripe}
									style={{
										width: '100%',
										padding: '16px',
										background: processing || !stripe ? '#999' : '#2d2d2d',
										color: '#fff',
										border: 'none',
										borderRadius: '4px',
										fontSize: '14px',
										fontWeight: '700',
										textTransform: 'uppercase',
										letterSpacing: '1px',
										cursor: processing || !stripe ? 'not-allowed' : 'pointer',
										transition: 'all 0.3s',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										gap: '10px'
									}}
									onMouseEnter={(e) => {
										if (!processing && stripe) e.target.style.background = '#111';
									}}
									onMouseLeave={(e) => {
										if (!processing && stripe) e.target.style.background = '#2d2d2d';
									}}
								>
									{processing ? (
										<>
											<i className="fa fa-spinner fa-spin"></i>
											Processing Payment...
										</>
									) : (
										<>
											<i className="fa fa-lock"></i>
											Pay ${finalTotal.toFixed(2)}
										</>
									)}
								</button>
							</div>
						</div>
					</div>
				</form>
			</div>
		</section>
	);
};

export default CheckoutPage;