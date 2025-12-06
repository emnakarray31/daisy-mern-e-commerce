import Order from "../models/order.model.js";

export const getMyOrders = async (req, res) => {
	try {
		const userId = req.user._id;
		
		const orders = await Order.find({ user: userId })
			.populate("products.product", "name image images price")
			.sort({ createdAt: -1 });

		res.json(orders);
	} catch (error) {
		console.error("Error in getMyOrders:", error);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getOrderById = async (req, res) => {
	try {
		const { id } = req.params;
		const userId = req.user._id;

		const order = await Order.findOne({ _id: id, user: userId })
			.populate("products.product", "name image images price category");

		if (!order) {
			return res.status(404).json({ message: "Order not found" });
		}

		res.json(order);
	} catch (error) {
		console.error("Error in getOrderById:", error);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getOrderByNumber = async (req, res) => {
	try {
		const { orderNumber } = req.params;
		const userId = req.user._id;

		const order = await Order.findOne({ orderNumber, user: userId })
			.populate("products.product", "name image images price category");

		if (!order) {
			return res.status(404).json({ message: "Order not found" });
		}

		res.json(order);
	} catch (error) {
		console.error("Error in getOrderByNumber:", error);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const cancelOrder = async (req, res) => {
	try {
		const { id } = req.params;
		const userId = req.user._id;

		const order = await Order.findOne({ _id: id, user: userId });

		if (!order) {
			return res.status(404).json({ message: "Order not found" });
		}

		if (order.status !== "pending") {
			return res.status(400).json({ 
				message: "Only pending orders can be cancelled" 
			});
		}

		order.status = "cancelled";
		await order.save();

		res.json({ message: "Order cancelled successfully", order });
	} catch (error) {
		console.error("Error in cancelOrder:", error);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};


export const getAllOrders = async (req, res) => {
	try {
		const { page = 1, limit = 20, status, startDate, endDate } = req.query;

		const filter = {};
		
		if (status) {
			filter.status = status;
		}
		
		if (startDate || endDate) {
			filter.createdAt = {};
			if (startDate) filter.createdAt.$gte = new Date(startDate);
			if (endDate) filter.createdAt.$lte = new Date(endDate);
		}

		const orders = await Order.find(filter)
			.populate("user", "name email")
			.populate("products.product", "name image")
			.sort({ createdAt: -1 })
			.limit(limit * 1)
			.skip((page - 1) * limit);

		const total = await Order.countDocuments(filter);

		res.json({
			orders,
			totalPages: Math.ceil(total / limit),
			currentPage: Number(page),
			total
		});
	} catch (error) {
		console.error("Error in getAllOrders:", error);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const updateOrderStatus = async (req, res) => {
	try {
		const { id } = req.params;
		const { status } = req.body;

		const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
		if (!validStatuses.includes(status)) {
			return res.status(400).json({ message: "Invalid status" });
		}

		const order = await Order.findById(id);

		if (!order) {
			return res.status(404).json({ message: "Order not found" });
		}

		order.status = status;
		if (status === "shipped" && !order.shippedAt) {
			order.shippedAt = new Date();
		}
		if (status === "delivered" && !order.deliveredAt) {
			order.deliveredAt = new Date();
		}

		await order.save();

		res.json({ message: "Order status updated", order });
	} catch (error) {
		console.error("Error in updateOrderStatus:", error);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getOrderStats = async (req, res) => {
	try {
		const stats = await Order.aggregate([
			{
				$group: {
					_id: null,
					totalOrders: { $sum: 1 },
					totalRevenue: { $sum: "$totalAmount" },
					averageOrderValue: { $avg: "$totalAmount" },
					pendingOrders: {
						$sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] }
					},
					processingOrders: {
						$sum: { $cond: [{ $eq: ["$status", "processing"] }, 1, 0] }
					},
					shippedOrders: {
						$sum: { $cond: [{ $eq: ["$status", "shipped"] }, 1, 0] }
					},
					deliveredOrders: {
						$sum: { $cond: [{ $eq: ["$status", "delivered"] }, 1, 0] }
					},
					cancelledOrders: {
						$sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] }
					}
				}
			}
		]);
		const sixMonthsAgo = new Date();
		sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

		const monthlyStats = await Order.aggregate([
			{
				$match: {
					createdAt: { $gte: sixMonthsAgo },
					status: { $ne: "cancelled" }
				}
			},
			{
				$group: {
					_id: {
						year: { $year: "$createdAt" },
						month: { $month: "$createdAt" }
					},
					orders: { $sum: 1 },
					revenue: { $sum: "$totalAmount" }
				}
			},
			{ $sort: { "_id.year": 1, "_id.month": 1 } }
		]);

		res.json({
			overview: stats[0] || {
				totalOrders: 0,
				totalRevenue: 0,
				averageOrderValue: 0,
				pendingOrders: 0,
				processingOrders: 0,
				shippedOrders: 0,
				deliveredOrders: 0,
				cancelledOrders: 0
			},
			monthlyStats
		});
	} catch (error) {
		console.error("Error in getOrderStats:", error);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};
export const getOrderDetails = async (req, res) => {
	try {
		const { id } = req.params;

		const order = await Order.findById(id)
			.populate("user", "name email")
			.populate("products.product", "name image images price category");

		if (!order) {
			return res.status(404).json({ message: "Order not found" });
		}

		res.json(order);
	} catch (error) {
		console.error("Error in getOrderDetails:", error);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};