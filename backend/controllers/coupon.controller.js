import Coupon from "../models/coupon.model.js";


export const getMyCoupons = async (req, res) => {
	try {
		const userId = req.user._id;
		const now = new Date();
		const privateCoupons = await Coupon.find({
			userId: userId,
			isActive: true,
			expirationDate: { $gt: now }
		}).sort({ expirationDate: 1 });

		const publicCoupons = await Coupon.find({
			isPublic: true,
			isActive: true,
			expirationDate: { $gt: now },
			$or: [
				{ onePerUser: false },
				{ usedBy: { $ne: userId } }
			]
		}).sort({ expirationDate: 1 });

		const coupons = {
			myCoupons: privateCoupons.map(c => ({
				...c.toJSON(),
				category: 'personal'
			})),
			publicCoupons: publicCoupons.map(c => ({
				...c.toJSON(),
				category: 'public'
			}))
		};

		res.json(coupons);
	} catch (error) {
		console.error("Error in getMyCoupons:", error);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};
export const getCoupon = async (req, res) => {
	try {
		const coupon = await Coupon.findOne({ 
			userId: req.user._id, 
			isActive: true,
			expirationDate: { $gt: new Date() }
		});
		res.json(coupon || null);
	} catch (error) {
		console.error("Error in getCoupon:", error);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};
export const validateCoupon = async (req, res) => {
	try {
		const { code, cartTotal = 0 } = req.body;
		const userId = req.user._id;

		if (!code) {
			return res.status(400).json({ message: "Coupon code is required" });
		}
		const coupon = await Coupon.findOne({
			code: code.toUpperCase().trim(),
			$or: [
				{ isPublic: true },
				{ userId: userId }
			]
		});

		if (!coupon) {
			return res.status(404).json({ message: "Coupon not found" });
		}

		const validation = coupon.isValid(userId, cartTotal);
		if (!validation.valid) {
			return res.status(400).json({ message: validation.message });
		}

		const discount = coupon.calculateDiscount(cartTotal);

		res.json({
			message: "Coupon is valid",
			coupon: {
				_id: coupon._id,
				code: coupon.code,
				type: coupon.type,
				discountValue: coupon.discountValue,
				discountPercentage: coupon.type === 'percentage' ? coupon.discountValue : null,
				displayText: coupon.displayText,
				description: coupon.description,
				minimumPurchase: coupon.minimumPurchase,
				maxDiscount: coupon.maxDiscount,
				expirationDate: coupon.expirationDate,
				isFreeShipping: coupon.type === 'freeShipping'
			},
			calculatedDiscount: discount
		});
	} catch (error) {
		console.error("Error in validateCoupon:", error);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

 export const useCoupon = async (req, res) => {
	try {
		const { code } = req.body;
		const userId = req.user._id;

		const coupon = await Coupon.findOne({ code: code.toUpperCase().trim() });

		if (!coupon) {
			return res.status(404).json({ message: "Coupon not found" });
		}

		await coupon.markAsUsed(userId);

		res.json({ message: "Coupon marked as used" });
	} catch (error) {
		console.error("Error in useCoupon:", error);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};
 

export const getAllCoupons = async (req, res) => {
	try {
		const { page = 1, limit = 20, type, isActive, isPublic } = req.query;

		const filter = {};
		if (type) filter.type = type;
		if (isActive !== undefined) filter.isActive = isActive === 'true';
		if (isPublic !== undefined) filter.isPublic = isPublic === 'true';

		const coupons = await Coupon.find(filter)
			.populate('userId', 'name email')
			.sort({ createdAt: -1 })
			.limit(limit * 1)
			.skip((page - 1) * limit);

		const total = await Coupon.countDocuments(filter);

		res.json({
			coupons,
			totalPages: Math.ceil(total / limit),
			currentPage: page,
			total
		});
	} catch (error) {
		console.error("Error in getAllCoupons:", error);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const createCoupon = async (req, res) => {
	try {
		const {
			code,
			type = 'percentage',
			discountValue,
			minimumPurchase = 0,
			maxDiscount = null,
			expirationDate,
			isPublic = false,
			userId = null,
			maxUses = null,
			onePerUser = true,
			description = '',
			applicableCategories = [],
			applicableProducts = []
		} = req.body;

		if (!code || !discountValue || !expirationDate) {
			return res.status(400).json({ 
				message: "Code, discount value and expiration date are required" 
			});
		}
		const existingCoupon = await Coupon.findOne({ code: code.toUpperCase().trim() });
		if (existingCoupon) {
			return res.status(400).json({ message: "Coupon code already exists" });
		}

		if (type === 'percentage' && (discountValue < 0 || discountValue > 100)) {
			return res.status(400).json({ message: "Percentage must be between 0 and 100" });
		}

		const newCoupon = new Coupon({
			code: code.toUpperCase().trim(),
			type,
			discountValue,
			discountPercentage: type === 'percentage' ? discountValue : null,
			minimumPurchase,
			maxDiscount,
			expirationDate: new Date(expirationDate),
			isPublic,
			userId: isPublic ? null : userId,
			maxUses,
			onePerUser,
			description,
			applicableCategories,
			applicableProducts
		});

		await newCoupon.save();

		res.status(201).json({
			message: "Coupon created successfully",
			coupon: newCoupon
		});
	} catch (error) {
		console.error("Error in createCoupon:", error);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

 export const updateCoupon = async (req, res) => {
	try {
		const { id } = req.params;
		const updates = req.body;

 		delete updates.code;

		const coupon = await Coupon.findByIdAndUpdate(
			id,
			{ $set: updates },
			{ new: true, runValidators: true }
		);

		if (!coupon) {
			return res.status(404).json({ message: "Coupon not found" });
		}

		res.json({
			message: "Coupon updated successfully",
			coupon
		});
	} catch (error) {
		console.error("Error in updateCoupon:", error);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

 export const deleteCoupon = async (req, res) => {
	try {
		const { id } = req.params;

		const coupon = await Coupon.findByIdAndDelete(id);

		if (!coupon) {
			return res.status(404).json({ message: "Coupon not found" });
		}

		res.json({ message: "Coupon deleted successfully" });
	} catch (error) {
		console.error("Error in deleteCoupon:", error);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

 export const toggleCouponStatus = async (req, res) => {
	try {
		const { id } = req.params;

		const coupon = await Coupon.findById(id);

		if (!coupon) {
			return res.status(404).json({ message: "Coupon not found" });
		}

		coupon.isActive = !coupon.isActive;
		await coupon.save();

		res.json({
			message: `Coupon ${coupon.isActive ? 'activated' : 'deactivated'} successfully`,
			coupon
		});
	} catch (error) {
		console.error("Error in toggleCouponStatus:", error);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

 export const createGiftCoupon = async (userId, orderTotal) => {
	try {
 		await Coupon.findOneAndDelete({ 
			userId, 
			description: { $regex: /gift/i } 
		});

		let discountValue = 10;
		if (orderTotal >= 500) discountValue = 20;
		else if (orderTotal >= 300) discountValue = 15;

		const code = "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase();

		const newCoupon = new Coupon({
			code,
			type: 'percentage',
			discountValue,
			discountPercentage: discountValue,
			minimumPurchase: 50,
			expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 jours
			isPublic: false,
			userId,
			onePerUser: true,
			description: `Gift coupon - Thank you for your $${orderTotal.toFixed(2)} purchase!`
		});

		await newCoupon.save();
		console.log(`🎁 Gift coupon created: ${code} (${discountValue}% off) for user ${userId}`);

		return newCoupon;
	} catch (error) {
		console.error("Error creating gift coupon:", error);
		return null;
	}
};

export const getCouponStats = async (req, res) => {
	try {
		const stats = await Coupon.aggregate([
			{
				$group: {
					_id: null,
					totalCoupons: { $sum: 1 },
					activeCoupons: {
						$sum: { $cond: ["$isActive", 1, 0] }
					},
					publicCoupons: {
						$sum: { $cond: ["$isPublic", 1, 0] }
					},
					totalUsed: { $sum: "$usedCount" },
					byType: {
						$push: "$type"
					}
				}
			}
		]);

		const typeStats = await Coupon.aggregate([
			{
				$group: {
					_id: "$type",
					count: { $sum: 1 },
					totalUsed: { $sum: "$usedCount" }
				}
			}
		]);

		res.json({
			overview: stats[0] || {
				totalCoupons: 0,
				activeCoupons: 0,
				publicCoupons: 0,
				totalUsed: 0
			},
			byType: typeStats
		});
	} catch (error) {
		console.error("Error in getCouponStats:", error);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};