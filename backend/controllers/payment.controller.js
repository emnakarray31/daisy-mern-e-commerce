import Coupon from "../models/coupon.model.js";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import Stripe from "stripe";
import User from "../models/user.model.js";

console.log("🔑 Initializing Stripe in payment controller...");
console.log("STRIPE_SECRET_KEY exists:", !!process.env.STRIPE_SECRET_KEY);

if (!process.env.STRIPE_SECRET_KEY) {
	console.error('❌ CRITICAL: STRIPE_SECRET_KEY is not available!');
	console.error('Make sure env.js is imported FIRST in server.js');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
console.log('✅ Stripe initialized successfully');


export const createPaymentIntent = async (req, res) => {
	try {
		console.log("\n📝 Creating payment intent...");
		console.log("User ID:", req.user?._id);

		const { amount, products, couponCode, shippingInfo } = req.body;

		if (!amount || amount <= 0) {
			return res.status(400).json({ 
				success: false, 
				message: "Invalid amount" 
			});
		}

		if (!Array.isArray(products) || products.length === 0) {
			return res.status(400).json({ 
				success: false, 
				message: "Invalid or empty products array" 
			});
		}

		let finalAmount = amount;
		let appliedCoupon = null;

		if (couponCode) {
			const coupon = await Coupon.findOne({ 
				code: couponCode, 
				userId: req.user._id, 
				isActive: true 
			});

			if (coupon && coupon.expirationDate > new Date()) {
				const discount = (finalAmount * coupon.discountPercentage) / 100;
				finalAmount -= discount;
				appliedCoupon = coupon;
			}
		}

		const amountInCents = Math.round(finalAmount);
		
		if (amountInCents < 50) {
			return res.status(400).json({ 
				success: false, 
				message: "Amount must be at least $0.50" 
			});
		}

		console.log("💳 Creating Stripe payment intent:", amountInCents, "cents");

 		const paymentIntent = await stripe.paymentIntents.create({
			amount: amountInCents,
			currency: "usd",
			metadata: {
				userId: req.user._id.toString(),
				couponCode: couponCode || "",
 				products: JSON.stringify(
					products.map((p) => ({
						id: p._id,
						quantity: p.quantity,
						price: p.price,
						size: p.selectedSize || null,
						color: p.selectedColor || null,
					}))
				),
				shippingInfo: JSON.stringify(shippingInfo || {}),
			},
			automatic_payment_methods: {
				enabled: true,
			},
		});

		console.log("✅ Payment intent created:", paymentIntent.id);

		res.json({
			success: true,
			clientSecret: paymentIntent.client_secret,
			paymentIntentId: paymentIntent.id,
			appliedCoupon: appliedCoupon ? {
				code: appliedCoupon.code,
				discountPercentage: appliedCoupon.discountPercentage
			} : null
		});

	} catch (error) {
		console.error("❌ Payment intent error:", error);
		res.status(500).json({ 
			success: false, 
			message: "Error creating payment intent",
			error: error.message
		});
	}
};

export const confirmPayment = async (req, res) => {
	try {
		console.log("✅ Confirming payment...");
		const { paymentIntentId, shippingAddress, subtotal, discount, shippingCost, total, couponCode } = req.body;

		if (!paymentIntentId) {
			return res.status(400).json({
				success: false,
				message: "Payment intent ID is required"
			});
		}

 		const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
		console.log("📄 Payment intent status:", paymentIntent.status);

		if (paymentIntent.status === "succeeded") {
			const metadata = paymentIntent.metadata;

			if (metadata.couponCode) {
				await Coupon.findOneAndUpdate(
					{
						code: metadata.couponCode,
						userId: metadata.userId,
					},
					{
						isActive: false,
					}
				);
				console.log("🎟️ Coupon deactivated:", metadata.couponCode);
			}
			console.log("📦 Parsing products from metadata...");
			const products = JSON.parse(metadata.products);
			console.log("📦 Products:", JSON.stringify(products, null, 2));
			
			const shippingInfo = metadata.shippingInfo ? JSON.parse(metadata.shippingInfo) : null;

			const newOrder = new Order({
				user: metadata.userId,
				products: products.map(p => ({
					product: p.id,
					quantity: p.quantity,
					price: p.price,
					size: p.size || null,    
					color: p.color || null, 
				})),
				subtotal: subtotal || (paymentIntent.amount / 100),
				shippingCost: shippingCost || 0,
				discount: discount || 0,
				totalAmount: total || (paymentIntent.amount / 100),
				couponCode: couponCode || metadata.couponCode || null,
				shippingAddress: shippingAddress ? {
					fullName: `${shippingAddress.firstName || ''} ${shippingAddress.lastName || ''}`.trim(),
					address: shippingAddress.street || shippingAddress.address || '',
					city: shippingAddress.city || '',
					postalCode: shippingAddress.zipCode || shippingAddress.postalCode || '',
					country: shippingAddress.country || '',
					phone: shippingAddress.phone || '',
				} : (shippingInfo || {}),
				paymentMethod: "card",
				paymentStatus: "paid",
				status: "pending",
				paidAt: new Date(),
				stripePaymentIntentId: paymentIntentId,
			});

			await newOrder.save();
			console.log("📦 Order created:", newOrder._id, "- Order Number:", newOrder.orderNumber);

			console.log("📉 Decrementing product stock in database...");
			for (const item of products) {
				try {
					console.log(`  🔍 Processing product ID: ${item.id}, Quantity: ${item.quantity}`);
					
 					const result = await Product.findByIdAndUpdate(
						item.id,
						{ $inc: { totalStock: -item.quantity } },
						{ new: true }  
					);
					
					if (result) {
						if (result.totalStock < 0) {
							await Product.findByIdAndUpdate(
								item.id,
								{ $set: { totalStock: 0 } }
							);
							console.log(`  ✅ ${result.name}: Stock set to 0 (was negative after decrement)`);
						} else {
							console.log(`  ✅ ${result.name}: New stock = ${result.totalStock} (decremented by ${item.quantity})`);
						}
					} else {
						console.log(`  ⚠️ Product not found: ${item.id}`);
					}
				} catch (error) {
					console.error(`  ❌ Failed to update stock for ${item.id}:`, error.message);
				}
			}
			console.log("✅ Stock updated in database!");

			if (paymentIntent.amount >= 20000) {
				await createNewCoupon(metadata.userId);
			}

			res.json({
				success: true,
				message: "Payment confirmed and order created",
				orderId: newOrder._id,
				orderNumber: newOrder.orderNumber,
			});
		} else {
			console.log("⚠️ Payment not successful, status:", paymentIntent.status);
			res.status(400).json({
				success: false,
				message: "Payment not successful",
				status: paymentIntent.status
			});
		}
	} catch (error) {
		console.error("❌ Error confirming payment:", error);
		res.status(500).json({
			success: false,
			message: "Error confirming payment",
			error: error.message,
		});
	}
};


async function createStripeCoupon(discountPercentage) {
	const coupon = await stripe.coupons.create({
		percent_off: discountPercentage,
		duration: "once",
	});

	return coupon.id;
}

async function createNewCoupon(userId) {
	try {
		await Coupon.findOneAndDelete({ userId });

		const newCoupon = new Coupon({
			code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
			discountPercentage: 10,
			expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
			userId: userId,
		});

		await newCoupon.save();
		console.log("🎁 New coupon created:", newCoupon.code);

		return newCoupon;
	} catch (error) {
		console.error("Error creating coupon:", error);
	}
}