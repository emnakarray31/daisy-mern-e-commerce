import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "../lib/axios";
import toast from "react-hot-toast";

const CouponsTab = () => {
	const [coupons, setCoupons] = useState([]);
	const [loading, setLoading] = useState(true);
	const [stats, setStats] = useState(null);
	const [showCreateForm, setShowCreateForm] = useState(false);
	const [editingCoupon, setEditingCoupon] = useState(null);
	 
	const [formData, setFormData] = useState({
		code: "",
		type: "percentage",
		discountValue: "",
		minimumPurchase: "",
		maxDiscount: "",
		expirationDate: "",
		isPublic: true,
		maxUses: "",
		onePerUser: true,
		description: ""
	});

	useEffect(() => {
		fetchCoupons();
		fetchStats();
	}, []);

	const fetchCoupons = async () => {
		try {
			setLoading(true);
			const res = await axios.get("/coupons/admin/all");
			setCoupons(res.data.coupons);
		} catch (error) {
			toast.error("Failed to load coupons");
		} finally {
			setLoading(false);
		}
	};

	const fetchStats = async () => {
		try {
			const res = await axios.get("/coupons/admin/stats");
			setStats(res.data);
		} catch (error) {
			console.error("Failed to load stats");
		}
	};

	const handleInputChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: type === 'checkbox' ? checked : value
		}));
	};

	const resetForm = () => {
		setFormData({
			code: "",
			type: "percentage",
			discountValue: "",
			minimumPurchase: "",
			maxDiscount: "",
			expirationDate: "",
			isPublic: true,
			maxUses: "",
			onePerUser: true,
			description: ""
		});
		setShowCreateForm(false);
		setEditingCoupon(null);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		
		try {
			const data = {
				...formData,
				discountValue: Number(formData.discountValue),
				minimumPurchase: formData.minimumPurchase ? Number(formData.minimumPurchase) : 0,
				maxDiscount: formData.maxDiscount ? Number(formData.maxDiscount) : null,
				maxUses: formData.maxUses ? Number(formData.maxUses) : null
			};

			if (editingCoupon) {
				await axios.put(`/coupons/admin/${editingCoupon._id}`, data);
				toast.success("Coupon updated successfully");
			} else {
				await axios.post("/coupons/admin/create", data);
				toast.success("Coupon created successfully");
			}

			resetForm();
			fetchCoupons();
			fetchStats();
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to save coupon");
		}
	};

	const handleEdit = (coupon) => {
		setEditingCoupon(coupon);
		setFormData({
			code: coupon.code,
			type: coupon.type,
			discountValue: coupon.discountValue,
			minimumPurchase: coupon.minimumPurchase || "",
			maxDiscount: coupon.maxDiscount || "",
			expirationDate: coupon.expirationDate ? new Date(coupon.expirationDate).toISOString().split('T')[0] : "",
			isPublic: coupon.isPublic,
			maxUses: coupon.maxUses || "",
			onePerUser: coupon.onePerUser,
			description: coupon.description || ""
		});
		setShowCreateForm(true);
	};

	const handleDelete = async (id) => {
		if (!window.confirm("Are you sure you want to delete this coupon?")) return;

		try {
			await axios.delete(`/coupons/admin/${id}`);
			toast.success("Coupon deleted");
			fetchCoupons();
			fetchStats();
		} catch (error) {
			toast.error("Failed to delete coupon");
		}
	};

	const handleToggleStatus = async (id) => {
		try {
			await axios.patch(`/coupons/admin/${id}/toggle`);
			fetchCoupons();
			toast.success("Coupon status updated");
		} catch (error) {
			toast.error("Failed to update status");
		}
	};

	const getTypeLabel = (type) => {
		switch (type) {
			case 'percentage': return 'Percentage';
			case 'fixed': return 'Fixed Amount';
			case 'freeShipping': return 'Free Shipping';
			default: return type;
		}
	};

	const getTypeColor = (type) => {
		switch (type) {
			case 'percentage': return '#e53637';
			case 'fixed': return '#10b981';
			case 'freeShipping': return '#3b82f6';
			default: return '#666';
		}
	};

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			 
			{stats && (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
					<motion.div
						className="bg-gray-800 rounded-lg p-6"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
					>
						<p className="text-gray-400 text-sm">Total Coupons</p>
						<p className="text-3xl font-bold text-white">{stats.overview.totalCoupons}</p>
					</motion.div>
					<motion.div
						className="bg-gray-800 rounded-lg p-6"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.1 }}
					>
						<p className="text-gray-400 text-sm">Active Coupons</p>
						<p className="text-3xl font-bold text-emerald-400">{stats.overview.activeCoupons}</p>
					</motion.div>
					<motion.div
						className="bg-gray-800 rounded-lg p-6"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
					>
						<p className="text-gray-400 text-sm">Public Coupons</p>
						<p className="text-3xl font-bold text-blue-400">{stats.overview.publicCoupons}</p>
					</motion.div>
					<motion.div
						className="bg-gray-800 rounded-lg p-6"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3 }}
					>
						<p className="text-gray-400 text-sm">Total Used</p>
						<p className="text-3xl font-bold text-yellow-400">{stats.overview.totalUsed}</p>
					</motion.div>
				</div>
			)}
 
			<div className="flex justify-between items-center mb-6">
				<h2 className="text-2xl font-bold text-emerald-400">Manage Coupons</h2>
				<button
					onClick={() => setShowCreateForm(!showCreateForm)}
					className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
				>
					{showCreateForm ? (
						<>
							<i className="fa fa-times"></i> Cancel
						</>
					) : (
						<>
							<i className="fa fa-plus"></i> Create Coupon
						</>
					)}
				</button>
			</div>
 
			{showCreateForm && (
				<motion.div
					className="bg-gray-800 rounded-lg p-6 mb-8"
					initial={{ opacity: 0, height: 0 }}
					animate={{ opacity: 1, height: 'auto' }}
				>
					<h3 className="text-xl font-semibold text-white mb-6">
						{editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
					</h3>
					
					<form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6"> 
						<div>
							<label className="block text-sm font-medium text-gray-300 mb-2">
								Coupon Code *
							</label>
							<input
								type="text"
								name="code"
								value={formData.code}
								onChange={handleInputChange}
								placeholder="e.g., SUMMER20"
								required
								disabled={editingCoupon}
								className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white uppercase placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
							/>
						</div>
 
						<div>
							<label className="block text-sm font-medium text-gray-300 mb-2">
								Discount Type *
							</label>
							<select
								name="type"
								value={formData.type}
								onChange={handleInputChange}
								className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
							>
								<option value="percentage">Percentage (%)</option>
								<option value="fixed">Fixed Amount ($)</option>
								<option value="freeShipping">Free Shipping</option>
							</select>
						</div> 
						{formData.type !== 'freeShipping' && (
							<div>
								<label className="block text-sm font-medium text-gray-300 mb-2">
									{formData.type === 'percentage' ? 'Discount Percentage *' : 'Discount Amount ($) *'}
								</label>
								<input
									type="number"
									name="discountValue"
									value={formData.discountValue}
									onChange={handleInputChange}
									placeholder={formData.type === 'percentage' ? "e.g., 20" : "e.g., 10"}
									required
									min="0"
									max={formData.type === 'percentage' ? "100" : undefined}
									step="0.01"
									className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
								/>
							</div>
						)}
 
						<div>
							<label className="block text-sm font-medium text-gray-300 mb-2">
								Minimum Purchase ($)
							</label>
							<input
								type="number"
								name="minimumPurchase"
								value={formData.minimumPurchase}
								onChange={handleInputChange}
								placeholder="0 for no minimum"
								min="0"
								step="0.01"
								className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
							/>
						</div>
 
						{formData.type === 'percentage' && (
							<div>
								<label className="block text-sm font-medium text-gray-300 mb-2">
									Maximum Discount ($)
								</label>
								<input
									type="number"
									name="maxDiscount"
									value={formData.maxDiscount}
									onChange={handleInputChange}
									placeholder="Leave empty for no limit"
									min="0"
									step="0.01"
									className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
								/>
							</div>
						)}
 
						<div>
							<label className="block text-sm font-medium text-gray-300 mb-2">
								Expiration Date *
							</label>
							<input
								type="date"
								name="expirationDate"
								value={formData.expirationDate}
								onChange={handleInputChange}
								required
								min={new Date().toISOString().split('T')[0]}
								className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
							/>
						</div>
 
						<div>
							<label className="block text-sm font-medium text-gray-300 mb-2">
								Maximum Uses
							</label>
							<input
								type="number"
								name="maxUses"
								value={formData.maxUses}
								onChange={handleInputChange}
								placeholder="Leave empty for unlimited"
								min="1"
								className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
							/>
						</div>
 
						<div className="md:col-span-2">
							<label className="block text-sm font-medium text-gray-300 mb-2">
								Description
							</label>
							<input
								type="text"
								name="description"
								value={formData.description}
								onChange={handleInputChange}
								placeholder="e.g., Summer sale - 20% off everything!"
								className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
							/>
						</div>
 
						<div className="md:col-span-2 flex flex-wrap gap-6">
							<label className="flex items-center gap-2 cursor-pointer">
								<input
									type="checkbox"
									name="isPublic"
									checked={formData.isPublic}
									onChange={handleInputChange}
									className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-emerald-600 focus:ring-emerald-500"
								/>
								<span className="text-gray-300">Public Coupon (available to all users)</span>
							</label>

							<label className="flex items-center gap-2 cursor-pointer">
								<input
									type="checkbox"
									name="onePerUser"
									checked={formData.onePerUser}
									onChange={handleInputChange}
									className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-emerald-600 focus:ring-emerald-500"
								/>
								<span className="text-gray-300">One use per user</span>
							</label>
						</div>
 
						<div className="md:col-span-2 flex gap-4">
							<button
								type="submit"
								className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
							>
								{editingCoupon ? 'Update Coupon' : 'Create Coupon'}
							</button>
							<button
								type="button"
								onClick={resetForm}
								className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
							>
								Cancel
							</button>
						</div>
					</form>
				</motion.div>
			)} 
			<motion.div
				className="bg-gray-800 rounded-lg overflow-hidden"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
			>
				{loading ? (
					<div className="text-center py-12">
						<i className="fa fa-spinner fa-spin text-4xl text-emerald-400"></i>
						<p className="text-gray-400 mt-4">Loading coupons...</p>
					</div>
				) : coupons.length === 0 ? (
					<div className="text-center py-12">
						<i className="fa fa-ticket text-6xl text-gray-600 mb-4"></i>
						<p className="text-gray-400">No coupons found. Create your first one!</p>
					</div>
				) : (
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead className="bg-gray-700">
								<tr>
									<th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Code</th>
									<th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Type</th>
									<th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Discount</th>
									<th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Min. Purchase</th>
									<th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Uses</th>
									<th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Expires</th>
									<th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
									<th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-700">
								{coupons.map((coupon) => (
									<tr key={coupon._id} className="hover:bg-gray-750">
										<td className="px-6 py-4">
											<div className="flex items-center gap-2">
												<span className="font-mono font-bold text-white">{coupon.code}</span>
												{coupon.isPublic && (
													<span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded">Public</span>
												)}
											</div>
										</td>
										<td className="px-6 py-4">
											<span 
												className="px-2 py-1 rounded text-xs font-semibold"
												style={{ 
													backgroundColor: `${getTypeColor(coupon.type)}20`,
													color: getTypeColor(coupon.type)
												}}
											>
												{getTypeLabel(coupon.type)}
											</span>
										</td>
										<td className="px-6 py-4 text-white font-semibold">
											{coupon.type === 'percentage' && `${coupon.discountValue}%`}
											{coupon.type === 'fixed' && `$${coupon.discountValue}`}
											{coupon.type === 'freeShipping' && 'Free Ship'}
										</td>
										<td className="px-6 py-4 text-gray-300">
											{coupon.minimumPurchase > 0 ? `$${coupon.minimumPurchase}` : '-'}
										</td>
										<td className="px-6 py-4 text-gray-300">
											{coupon.usedCount} / {coupon.maxUses || '∞'}
										</td>
										<td className="px-6 py-4 text-gray-300">
											{new Date(coupon.expirationDate).toLocaleDateString()}
											{new Date(coupon.expirationDate) < new Date() && (
												<span className="ml-2 text-red-400 text-xs">(Expired)</span>
											)}
										</td>
										<td className="px-6 py-4">
											<button
												onClick={() => handleToggleStatus(coupon._id)}
												className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
													coupon.isActive 
														? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' 
														: 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
												}`}
											>
												{coupon.isActive ? 'Active' : 'Inactive'}
											</button>
										</td>
										<td className="px-6 py-4">
											<div className="flex gap-2">
												<button
													onClick={() => handleEdit(coupon)}
													className="text-blue-400 hover:text-blue-300 p-2"
													title="Edit"
												>
													<i className="fa fa-pencil"></i>
												</button>
												<button
													onClick={() => handleDelete(coupon._id)}
													className="text-red-400 hover:text-red-300 p-2"
													title="Delete"
												>
													<i className="fa fa-trash"></i>
												</button>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</motion.div>
		</div>
	);
};

export default CouponsTab;