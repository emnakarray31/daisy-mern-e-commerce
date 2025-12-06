import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";
import Wishlist from "../models/Wishlist.model.js";

 export const getAnalyticsData = async () => {
	const totalUsers = await User.countDocuments();
	const totalProducts = await Product.countDocuments();

	const salesData = await Order.aggregate([
		{
			$group: {
				_id: null,
				totalSales: { $sum: 1 },
				totalRevenue: { $sum: "$totalAmount" },
			},
		},
	]);

	const { totalSales, totalRevenue } = salesData[0] || { totalSales: 0, totalRevenue: 0 };

	return {
		users: totalUsers,
		products: totalProducts,
		totalSales,
		totalRevenue,
	};
};

export const getDailySalesData = async (startDate, endDate) => {
	try {
		const dailySalesData = await Order.aggregate([
			{
				$match: {
					createdAt: {
						$gte: startDate,
						$lte: endDate,
					},
				},
			},
			{
				$group: {
					_id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
					sales: { $sum: 1 },
					revenue: { $sum: "$totalAmount" },
				},
			},
			{ $sort: { _id: 1 } },
		]);

		const dateArray = getDatesInRange(startDate, endDate);

		return dateArray.map((date) => {
			const foundData = dailySalesData.find((item) => item._id === date);

			return {
				date,
				sales: foundData?.sales || 0,
				revenue: foundData?.revenue || 0,
			};
		});
	} catch (error) {
		throw error;
	}
};

function getDatesInRange(startDate, endDate) {
	const dates = [];
	let currentDate = new Date(startDate);

	while (currentDate <= endDate) {
		dates.push(currentDate.toISOString().split("T")[0]);
		currentDate.setDate(currentDate.getDate() + 1);
	}

	return dates;
}

export const getTopProducts = async (req, res) => {
	try {
		const { limit = 10 } = req.query;

		const topProducts = await Order.aggregate([
			{ $unwind: "$products" },
			{
				$group: {
					_id: "$products.product",
					salesCount: { $sum: "$products.quantity" },
					revenue: { $sum: { $multiply: ["$products.price", "$products.quantity"] } },
				},
			},
			{ $sort: { salesCount: -1 } },
			{ $limit: parseInt(limit) },
			{
				$lookup: {
					from: "products",
					localField: "_id",
					foreignField: "_id",
					as: "productInfo",
				},
			},
			{ $unwind: "$productInfo" },
			{
				$project: {
					_id: "$productInfo._id",
					name: "$productInfo.name",
					image: "$productInfo.image",
					category: "$productInfo.category",
					price: "$productInfo.price",
					salesCount: 1,
					revenue: 1,
				},
			},
		]);

		res.json({ products: topProducts });
	} catch (error) {
		console.error("Error in getTopProducts:", error);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getWishlistStats = async (req, res) => {
	try {
		const { limit = 10 } = req.query;

		const wishlists = await Wishlist.find().populate('products.product');

		const productCounts = {};
		wishlists.forEach(wishlist => {
			wishlist.products.forEach(item => {
				const productId = item.product._id.toString();
				if (!productCounts[productId]) {
					productCounts[productId] = {
						product: item.product,
						count: 0
					};
				}
				productCounts[productId].count += 1;
			});
		});
		const topWishlisted = Object.values(productCounts)
			.sort((a, b) => b.count - a.count)
			.slice(0, parseInt(limit))
			.map(item => ({
				_id: item.product._id,
				name: item.product.name,
				image: item.product.image,
				category: item.product.category,
				price: item.product.price,
				wishlistCount: item.count,
				conversionRate: 0, 
			}));
		const totalWishlists = wishlists.length;
		const totalWishlistedProducts = Object.keys(productCounts).length;

		res.json({
			topProducts: topWishlisted,
			totalWishlists,
			totalWishlistedProducts,
		});
	} catch (error) {
		console.error("Error in getWishlistStats:", error);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getCategoryStats = async (req, res) => {
	try {
		const categoryDistribution = await Product.aggregate([
			{
				$group: {
					_id: "$category",
					count: { $sum: 1 },
					totalStock: { $sum: "$totalStock" },
				},
			},
			{ $sort: { count: -1 } },
		]);

		const revenueByCategory = await Order.aggregate([
			{ $unwind: "$products" },
			{
				$lookup: {
					from: "products",
					localField: "products.product",
					foreignField: "_id",
					as: "productInfo",
				},
			},
			{ $unwind: "$productInfo" },
			{
				$group: {
					_id: "$productInfo.category",
					revenue: { $sum: { $multiply: ["$products.price", "$products.quantity"] } },
					orders: { $sum: 1 },
				},
			},
			{ $sort: { revenue: -1 } },
		]);

		const categories = categoryDistribution.map(cat => ({
			name: cat._id,
			value: cat.count,
			stock: cat.totalStock,
		}));

		const revenue = revenueByCategory.map(cat => ({
			name: cat._id,
			revenue: cat.revenue,
			orders: cat.orders,
		}));

		res.json({ categories, revenue });
	} catch (error) {
		console.error("Error in getCategoryStats:", error);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};


export const getUserStats = async (req, res) => {
	try {
		const totalUsers = await User.countDocuments();
		const admins = await User.countDocuments({ role: "admin" });
		const customers = totalUsers - admins;

 		const topCustomers = await Order.aggregate([
			{
				$group: {
					_id: "$user",
					totalSpent: { $sum: "$totalAmount" },
					orderCount: { $sum: 1 },
				},
			},
			{ $sort: { totalSpent: -1 } },
			{ $limit: 10 },
			{
				$lookup: {
					from: "users",
					localField: "_id",
					foreignField: "_id",
					as: "userInfo",
				},
			},
			{ $unwind: "$userInfo" },
			{
				$project: {
					_id: "$userInfo._id",
					name: "$userInfo.name",
					email: "$userInfo.email",
					totalSpent: 1,
					orderCount: 1,
				},
			},
		]);

 		const revenueData = await Order.aggregate([
			{
				$group: {
					_id: null,
					totalRevenue: { $sum: "$totalAmount" },
				},
			},
		]);

		const totalRevenue = revenueData[0]?.totalRevenue || 0;

		res.json({
			total: totalUsers,
			admins,
			customers,
			totalRevenue,
			topCustomers,
		});
	} catch (error) {
		console.error("Error in getUserStats:", error);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getComprehensiveMetrics = async (req, res) => {
	try {
		const { startDate, endDate } = req.query;
		const start = startDate ? new Date(startDate) : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
		const end = endDate ? new Date(endDate) : new Date();
		const basicAnalytics = await getAnalyticsData();
		const dailySales = await getDailySalesData(start, end);
		const avgOrderValue = basicAnalytics.totalRevenue / basicAnalytics.totalSales || 0;
		const totalVisits = 1000; 
		const conversionRate = (basicAnalytics.totalSales / totalVisits) * 100 || 0;

		res.json({
			analyticsData: {
				...basicAnalytics,
				avgOrderValue,
				conversionRate,
			},
			dailySalesData: dailySales,
		});
	} catch (error) {
		console.error("Error in getComprehensiveMetrics:", error);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};