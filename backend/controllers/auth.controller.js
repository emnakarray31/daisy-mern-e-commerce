import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendPasswordResetEmail, sendPasswordResetConfirmationEmail } from "../lib/email.js";

const generateTokens = (userId) => {
	const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: "15m",
	});

	const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
		expiresIn: "7d",
	});

	return { accessToken, refreshToken };
};

const setCookies = (res, accessToken, refreshToken) => {
	res.cookie("accessToken", accessToken, {
		httpOnly: true,  
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",  
		maxAge: 15 * 60 * 1000,  
	});
	res.cookie("refreshToken", refreshToken, {
		httpOnly: true,  
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",  
		maxAge: 7 * 24 * 60 * 60 * 1000,  
	});
};

export const signup = async (req, res) => {
	const { email, password, name } = req.body;
	try {
		const userExists = await User.findOne({ email });

		if (userExists) {
			return res.status(400).json({ message: "User already exists" });
		}
		const user = await User.create({ name, email, password });
		const { accessToken, refreshToken } = generateTokens(user._id);
		setCookies(res, accessToken, refreshToken);

		res.status(201).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			role: user.role,
		});
	} catch (error) {
		console.log("Error in signup controller", error.message);
		res.status(500).json({ message: error.message });
	}
};

export const login = async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email });

		if (user && (await user.comparePassword(password))) {
			const { accessToken, refreshToken } = generateTokens(user._id);
			setCookies(res, accessToken, refreshToken);

			res.json({
				_id: user._id,
				name: user.name,
				email: user.email,
				role: user.role,
			});
		} else {
			res.status(400).json({ message: "Invalid email or password" });
		}
	} catch (error) {
		console.log("Error in login controller", error.message);
		res.status(500).json({ message: error.message });
	}
};

export const logout = async (req, res) => {
	try {
		res.clearCookie("accessToken");
		res.clearCookie("refreshToken");
		res.json({ message: "Logged out successfully" });
	} catch (error) {
		console.log("Error in logout controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const refreshToken = async (req, res) => {
	try {
		const refreshToken = req.cookies.refreshToken;

		if (!refreshToken) {
			return res.status(401).json({ message: "No refresh token provided" });
		}

		const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
		const accessToken = jwt.sign({ userId: decoded.userId }, process.env.ACCESS_TOKEN_SECRET, {
			expiresIn: "15m",
		});

		res.cookie("accessToken", accessToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			maxAge: 15 * 60 * 1000,
		});

		res.json({ message: "Token refreshed successfully" });
	} catch (error) {
		console.log("Error in refreshToken controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getProfile = async (req, res) => {
	try {
		res.json(req.user);
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const forgotPassword = async (req, res) => {
	try {
		const { email } = req.body;

		if (!email) {
			return res.status(400).json({ message: "Email is required" });
		}

		const user = await User.findOne({ email });

		if (!user) { 
			return res.json({ message: "If this email exists, a password reset link has been sent" });
		}
 
		const resetToken = crypto.randomBytes(32).toString('hex');
 
		const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
 
		user.resetPasswordToken = hashedToken;
		user.resetPasswordExpires = Date.now() + 3600000;  
		await user.save(); 
		const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;

		console.log('Password reset URL:', resetUrl);
 
		try {
			await sendPasswordResetEmail(user.email, resetUrl, user.name);
			console.log('✅ Password reset email sent successfully to:', user.email);

			res.json({
				message: "If this email exists, a password reset link has been sent", 
				...(process.env.NODE_ENV !== 'production' && { resetUrl })
			});
		} catch (emailError) {
			console.error('❌ Failed to send email:', emailError); 
			res.json({
				message: "If this email exists, a password reset link has been sent", 
				...(process.env.NODE_ENV !== 'production' && {
					resetUrl,
					emailError: emailError.message
				})
			});
		}
	} catch (error) {
		console.log("Error in forgotPassword controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const resetPassword = async (req, res) => {
	try {
		const { token } = req.params;
		const { password } = req.body;

		if (!password) {
			return res.status(400).json({ message: "Password is required" });
		}

		if (password.length < 6) {
			return res.status(400).json({ message: "Password must be at least 6 characters long" });
		}
 
		const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
 
		const user = await User.findOne({
			resetPasswordToken: hashedToken,
			resetPasswordExpires: { $gt: Date.now() }
		});

		if (!user) {
			return res.status(400).json({ message: "Invalid or expired reset token" });
		}
 
		user.password = password;
		user.resetPasswordToken = null;
		user.resetPasswordExpires = null;
		await user.save();
 
		try {
			await sendPasswordResetConfirmationEmail(user.email, user.name);
			console.log('✅ Password reset confirmation email sent to:', user.email);
		} catch (emailError) {
			console.error('❌ Failed to send confirmation email:', emailError); 
		}

		res.json({ message: "Password has been reset successfully" });
	} catch (error) {
		console.log("Error in resetPassword controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};