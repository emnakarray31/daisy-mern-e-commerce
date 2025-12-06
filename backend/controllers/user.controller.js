import User from "../models/user.model.js";
import Order from "../models/order.model.js";
import Wishlist from "../models/Wishlist.model.js";
export const getAllUsers = async (req, res) => {
	try {
		const { page = 1, limit = 10, role, search } = req.query;
		let query = {};
		if (role && role !== 'all') {
			query.role = role;
		}

		if (search) {
			query.$or = [
				{ name: { $regex: search, $options: 'i' } },
				{ email: { $regex: search, $options: 'i' } },
			];
		}
		const users = await User.find(query)
			.select('-password')
			.populate({
				path: 'cartItems.product',
				select: 'name image price'
			})
			.limit(parseInt(limit))
			.skip((parseInt(page) - 1) * parseInt(limit))
			.sort({ createdAt: -1 });

		console.log(`📊 Found ${users.length} users`);

		const usersWithStats = await Promise.all(users.map(async (user) => {
			const userObj = user.toObject();
			const ordersCount = await Order.countDocuments({ user: user._id });
			const wishlist = await Wishlist.findOne({ user: user._id });
			const wishlistCount = wishlist?.products?.length || 0;

			console.log(`User ${userObj.name}:`, {
				orders: ordersCount,
				cartItems: userObj.cartItems?.length || 0,
				wishlist: wishlistCount
			});

			return {
				...userObj,
				orders: Array(ordersCount).fill({}), 
				cartItems: userObj.cartItems || [],
				wishlist: Array(wishlistCount).fill({}), 
			};
		}));
		const total = await User.countDocuments(query);

		res.json({
			users: usersWithStats,
			total,
			page: parseInt(page),
			pages: Math.ceil(total / parseInt(limit)),
		});
	} catch (error) {
		console.error("❌ Error in getAllUsers:", error);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};
export const getUserById = async (req, res) => {
	try {
		const { id } = req.params;

		const user = await User.findById(id).select('-password');
		
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		const orders = await Order.find({ user: id })
			.sort({ createdAt: -1 })
			.limit(5);

		const wishlist = await Wishlist.findOne({ user: id }).populate('products.product');

		const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0);
		const ordersCount = await Order.countDocuments({ user: id });

		res.json({
			...user.toObject(),
			ordersCount,
			totalSpent,
			wishlistCount: wishlist?.products?.length || 0,
			recentOrders: orders,
		});
	} catch (error) {
		console.error("Error in getUserById:", error);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};
export const updateUserRole = async (req, res) => {
	try {
		const { id } = req.params;
		const { role } = req.body;

		if (!['customer', 'admin'].includes(role)) {
			return res.status(400).json({ message: "Invalid role" });
		}

		const user = await User.findByIdAndUpdate(
			id,
			{ role },
			{ new: true }
		).select('-password');

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		res.json({
			message: "User role updated successfully",
			user,
		});
	} catch (error) {
		console.error("Error in updateUserRole:", error);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const deleteUser = async (req, res) => {
	try {
		const { id } = req.params;
		const user = await User.findById(id);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}
		if (id === req.user._id.toString()) {
			return res.status(400).json({ message: "Cannot delete your own account" });
		}
		await Wishlist.deleteOne({ user: id });
		await Order.updateMany(
			{ user: id },
			{ $set: { "user.name": "Deleted User", "user.email": "deleted@example.com" } }
		);
		await User.findByIdAndDelete(id);
		res.json({ message: "User deleted successfully" });
	} catch (error) {
		console.error("Error in deleteUser:", error);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getUserStats = async (req, res) => {
	try {
		const totalUsers = await User.countDocuments();
		const admins = await User.countDocuments({ role: "admin" });
		const customers = totalUsers - admins;
		const revenueData = await Order.aggregate([
			{
				$group: {
					_id: null,
					totalRevenue: { $sum: "$totalAmount" },
				},
			},
		]);

		const totalRevenue = revenueData[0]?.totalRevenue || 0;
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

export const createUser = async (req, res) => {
	try {
		const { name, email, password, role } = req.body;

		console.log("📝 Creating new user:", email);
		if (!name || !email || !password) {
			return res.status(400).json({
				success: false,
				message: "Name, email and password are required"
			});
		}
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({
				success: false,
				message: "User with this email already exists"
			});
		}
		const user = await User.create({
			name,
			email,
			password,
			role: role || 'customer'
		});

		console.log("✅ User created:", user._id, "-", user.email);

		const userResponse = user.toObject();
		delete userResponse.password;

		res.status(201).json({
			success: true,
			message: "User created successfully",
			user: userResponse
		});
	} catch (error) {
		console.error("❌ Error creating user:", error.message);
		res.status(500).json({
			success: false,
			message: "Error creating user",
			error: error.message
		});
	}
};
export const updateUser = async (req, res) => {
	try {
		const { id } = req.params;
		const { name, email, password, role } = req.body;

		console.log("📝 Updating user:", id);

		const user = await User.findById(id);
		if (!user) {
			return res.status(404).json({
				success: false,
				message: "User not found"
			});
		}
		if (name) user.name = name;
		if (email) {
			const existingUser = await User.findOne({ email, _id: { $ne: id } });
			if (existingUser) {
				return res.status(400).json({
					success: false,
					message: "Email already in use"
				});
			}
			user.email = email;
		}
		if (password) {
			user.password = password;
		}
		if (role) user.role = role;

		await user.save();

		console.log("✅ User updated:", user.email);
		const userResponse = user.toObject();
		delete userResponse.password;

		res.json({
			success: true,
			message: "User updated successfully",
			user: userResponse
		});
	} catch (error) {
		console.error("❌ Error updating user:", error.message);
		res.status(500).json({
			success: false,
			message: "Error updating user",
			error: error.message
		});
	}
};