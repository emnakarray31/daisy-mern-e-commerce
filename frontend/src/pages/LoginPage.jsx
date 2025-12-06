import { useState } from "react";
import { Link } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import axios from "../lib/axios";
import toast from "react-hot-toast";

const LoginPage = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [showForgotPassword, setShowForgotPassword] = useState(false);
	const [forgotEmail, setForgotEmail] = useState("");
	const [forgotLoading, setForgotLoading] = useState(false);

	const { login, loading } = useUserStore();

	const handleSubmit = (e) => {
		e.preventDefault();
		login(email, password);
	};

	const handleForgotPassword = async (e) => {
		e.preventDefault();
		if (!forgotEmail) {
			toast.error("Please enter your email");
			return;
		}

		setForgotLoading(true);
		try {
			const response = await axios.post("/auth/forgot-password", { email: forgotEmail });
			toast.success(response.data.message || "Password reset link sent!");
			if (response.data.resetUrl) {
				console.log("Reset URL:", response.data.resetUrl);
				toast.success("Check console for reset link (dev mode)");
			}

			setShowForgotPassword(false);
			setForgotEmail("");
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to send reset link");
		} finally {
			setForgotLoading(false);
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
						Welcome Back
					</h1>
					<p style={{
						fontSize: '18px',
						fontWeight: '300',
						opacity: 0.9
					}}>
						#Collection 2025
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
							Login
						</h2>
						<p style={{
							color: '#666',
							fontSize: '14px'
						}}>
							Enter your credentials to access your account
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
								Email Address
							</label>
							<div style={{position: 'relative'}}>
								<input
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
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
								<i className="fa fa-envelope" style={{
									position: 'absolute',
									right: '15px',
									top: '50%',
									transform: 'translateY(-50%)',
									color: '#999',
									fontSize: '14px'
								}}></i>
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
								Password
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
									<i className={showPassword ? "fa fa-eye-slash" : "fa fa-lock"} style={{fontSize: '14px'}}></i>
								</button>
							</div>
						</div>

						<div style={{
							textAlign: 'right',
							marginBottom: '20px'
						}}>
							<button
								type="button"
								onClick={() => setShowForgotPassword(true)}
								style={{
									background: 'none',
									border: 'none',
									color: '#666',
									fontSize: '13px',
									cursor: 'pointer',
									textDecoration: 'underline',
									padding: 0
								}}
								onMouseEnter={(e) => e.target.style.color = '#111'}
								onMouseLeave={(e) => e.target.style.color = '#666'}
							>
								Forgot Password?
							</button>
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
								gap: '10px'
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
									Logging in...
								</>
							) : (
								<>
									Login
									<i className="fa fa-arrow-right" style={{fontSize: '12px'}}></i>
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
							Don't have an account?
						</p>
						<Link 
							to="/signup"
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
							Create Account
						</Link>
					</div>
				</div>
			</div>

			{showForgotPassword && (
				<>
					<div
						onClick={() => setShowForgotPassword(false)}
						style={{
							position: 'fixed',
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
							background: 'rgba(0, 0, 0, 0.6)',
							zIndex: 999,
						}}
					/>
					<div style={{
						position: 'fixed',
						top: '50%',
						left: '50%',
						transform: 'translate(-50%, -50%)',
						background: '#fff',
						borderRadius: '12px',
						maxWidth: '500px',
						width: '90%',
						zIndex: 1000,
						boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
						padding: '40px',
					}}>
						<button
							onClick={() => setShowForgotPassword(false)}
							style={{
								position: 'absolute',
								top: '15px',
								right: '15px',
								background: 'none',
								border: 'none',
								fontSize: '24px',
								color: '#999',
								cursor: 'pointer',
								padding: 0,
								lineHeight: 1,
							}}
						>
							<i className="fa fa-times"></i>
						</button>

						<h2 style={{
							fontSize: '28px',
							fontWeight: '700',
							color: '#111',
							marginBottom: '15px',
							textTransform: 'uppercase',
							letterSpacing: '1px'
						}}>
							Forgot Password?
						</h2>
						<p style={{
							color: '#666',
							fontSize: '14px',
							marginBottom: '30px',
							lineHeight: '1.6'
						}}>
							Enter your email address and we'll send you a link to reset your password.
						</p>

						<form onSubmit={handleForgotPassword}>
							<div style={{ marginBottom: '25px' }}>
								<label style={{
									display: 'block',
									fontSize: '12px',
									fontWeight: '600',
									color: '#666',
									marginBottom: '8px',
									textTransform: 'uppercase',
									letterSpacing: '0.5px'
								}}>
									Email Address
								</label>
								<input
									type="email"
									value={forgotEmail}
									onChange={(e) => setForgotEmail(e.target.value)}
									required
									style={{
										width: '100%',
										padding: '14px 15px',
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
							</div>

							<button
								type="submit"
								disabled={forgotLoading}
								style={{
									width: '100%',
									padding: '16px',
									background: forgotLoading ? '#999' : '#2d2d2d',
									color: '#fff',
									border: 'none',
									fontSize: '14px',
									fontWeight: '700',
									cursor: forgotLoading ? 'not-allowed' : 'pointer',
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
									if (!forgotLoading) e.target.style.background = '#111';
								}}
								onMouseLeave={(e) => {
									if (!forgotLoading) e.target.style.background = '#2d2d2d';
								}}
							>
								{forgotLoading ? (
									<>
										<i className="fa fa-spinner fa-spin"></i>
										Sending...
									</>
								) : (
									<>
										Send Reset Link
										<i className="fa fa-paper-plane" style={{ fontSize: '12px' }}></i>
									</>
								)}
							</button>
						</form>
					</div>
				</>
			)}

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

export default LoginPage;