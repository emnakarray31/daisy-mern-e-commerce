import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "../lib/axios";
import toast from "react-hot-toast";

const ResetPasswordPage = () => {
	const { token } = useParams();
	const navigate = useNavigate();
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (password !== confirmPassword) {
			toast.error("Passwords do not match");
			return;
		}

		if (password.length < 6) {
			toast.error("Password must be at least 6 characters long");
			return;
		}

		setLoading(true);
		try {
			const response = await axios.post(`/auth/reset-password/${token}`, { password });
			toast.success(response.data.message || "Password reset successfully!");
			setTimeout(() => {
				navigate("/login");
			}, 2000);
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to reset password");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div style={{
			minHeight: '100vh',
			display: 'flex',
			background: '#fff'
		}}>
			 
			<div style={{
				flex: 1,
				background: 'linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.1)), url(/img/login-bg.jpg)',
				backgroundSize: 'cover',
				backgroundPosition: 'center',
				position: 'relative',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center'
			}}>
				<div style={{
					position: 'relative',
					zIndex: 1,
					textAlign: 'center',
					color: '#fff',
					padding: '40px'
				}}>
					<h1 style={{
						fontSize: '48px',
						fontWeight: '300',
						marginBottom: '20px',
						letterSpacing: '2px',
						textTransform: 'uppercase'
					}}>
						Reset Password
					</h1>
					<p style={{
						fontSize: '18px',
						fontWeight: '300',
						opacity: 0.9
					}}>
						Create a new secure password
					</p>
				</div>
			</div>

			 
			<div style={{
				flex: 1,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				padding: '40px',
				background: '#fff'
			}}>
				<div style={{
					width: '100%',
					maxWidth: '450px'
				}}>
					 
					<div style={{
						marginBottom: '50px',
						textAlign: 'center'
					}}>
						<h2 style={{
							fontSize: '32px',
							fontWeight: '700',
							color: '#111',
							marginBottom: '10px',
							letterSpacing: '1px',
							textTransform: 'uppercase'
						}}>
							New Password
						</h2>
						<p style={{
							color: '#666',
							fontSize: '14px'
						}}>
							Enter your new password below
						</p>
					</div>

					
					<form onSubmit={handleSubmit}>
						<div style={{marginBottom: '25px'}}>
							<label style={{
								display: 'block',
								fontSize: '12px',
								fontWeight: '600',
								color: '#666',
								marginBottom: '8px',
								textTransform: 'uppercase',
								letterSpacing: '0.5px'
							}}>
								New Password
							</label>
							<div style={{position: 'relative'}}>
								<input
									type={showPassword ? "text" : "password"}
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
									style={{
										width: '100%',
										padding: '14px 45px 14px 15px',
										border: 'none',
										borderBottom: '1px solid #e5e5e5',
										fontSize: '15px',
										transition: 'all 0.3s',
										outline: 'none',
										background: 'transparent',
										color: '#111'
									}}
									onFocus={(e) => e.target.style.borderBottomColor = '#111'}
									onBlur={(e) => e.target.style.borderBottomColor = '#e5e5e5'}
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									style={{
										position: 'absolute',
										right: '15px',
										top: '50%',
										transform: 'translateY(-50%)',
										background: 'none',
										border: 'none',
										cursor: 'pointer',
										padding: '5px',
										color: '#999'
									}}
								>
									<i className={showPassword ? "fa fa-eye-slash" : "fa fa-eye"} style={{fontSize: '14px'}}></i>
								</button>
							</div>
						</div>
						<div style={{marginBottom: '35px'}}>
							<label style={{
								display: 'block',
								fontSize: '12px',
								fontWeight: '600',
								color: '#666',
								marginBottom: '8px',
								textTransform: 'uppercase',
								letterSpacing: '0.5px'
							}}>
								Confirm Password
							</label>
							<div style={{position: 'relative'}}>
								<input
									type={showConfirmPassword ? "text" : "password"}
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
									required
									style={{
										width: '100%',
										padding: '14px 45px 14px 15px',
										border: 'none',
										borderBottom: '1px solid #e5e5e5',
										fontSize: '15px',
										transition: 'all 0.3s',
										outline: 'none',
										background: 'transparent',
										color: '#111'
									}}
									onFocus={(e) => e.target.style.borderBottomColor = '#111'}
									onBlur={(e) => e.target.style.borderBottomColor = '#e5e5e5'}
								/>
								<button
									type="button"
									onClick={() => setShowConfirmPassword(!showConfirmPassword)}
									style={{
										position: 'absolute',
										right: '15px',
										top: '50%',
										transform: 'translateY(-50%)',
										background: 'none',
										border: 'none',
										cursor: 'pointer',
										padding: '5px',
										color: '#999'
									}}
								>
									<i className={showConfirmPassword ? "fa fa-eye-slash" : "fa fa-eye"} style={{fontSize: '14px'}}></i>
								</button>
							</div>
						</div>
 
						<button
							type="submit"
							disabled={loading}
							style={{
								width: '100%',
								padding: '16px',
								background: loading ? '#999' : '#2d2d2d',
								color: '#fff',
								border: 'none',
								fontSize: '14px',
								fontWeight: '700',
								cursor: loading ? 'not-allowed' : 'pointer',
								transition: 'all 0.3s',
								textTransform: 'uppercase',
								letterSpacing: '2px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								gap: '10px',
								borderRadius: '4px'
							}}
							onMouseEnter={(e) => {
								if (!loading) e.target.style.background = '#111';
							}}
							onMouseLeave={(e) => {
								if (!loading) e.target.style.background = '#2d2d2d';
							}}
						>
							{loading ? (
								<>
									<i className="fa fa-spinner fa-spin"></i>
									Resetting...
								</>
							) : (
								<>
									Reset Password
									<i className="fa fa-check" style={{fontSize: '12px'}}></i>
								</>
							)}
						</button>
					</form>

					<div style={{
						margin: '40px 0',
						textAlign: 'center',
						position: 'relative'
					}}>
						<div style={{
							position: 'absolute',
							top: '50%',
							left: 0,
							right: 0,
							height: '1px',
							background: '#e5e5e5'
						}}></div>
						<span style={{
							position: 'relative',
							background: '#fff',
							padding: '0 20px',
							color: '#999',
							fontSize: '12px',
							fontWeight: '600',
							textTransform: 'uppercase',
							letterSpacing: '1px'
						}}>
							Or
						</span>
					</div>

					<div style={{
						textAlign: 'center'
					}}>
						<p style={{
							color: '#666',
							fontSize: '14px',
							marginBottom: '15px'
						}}>
							Remember your password?
						</p>
						<Link
							to="/login"
							style={{
								color: '#111',
								fontSize: '14px',
								fontWeight: '700',
								textDecoration: 'none',
								textTransform: 'uppercase',
								letterSpacing: '1px',
								borderBottom: '2px solid #111',
								paddingBottom: '2px',
								transition: 'all 0.3s'
							}}
							onMouseEnter={(e) => e.target.style.color = '#e53637'}
							onMouseLeave={(e) => e.target.style.color = '#111'}
						>
							Back to Login
						</Link>
					</div>
				</div>
			</div>

			<style>{`
				@media (max-width: 768px) {
					.login-page-container > div:first-child {
						display: none !important;
					}
				}
			`}</style>
		</div>
	);
};

export default ResetPasswordPage;
