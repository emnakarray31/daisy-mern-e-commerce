import { useState } from "react";
import { Link } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";

const SignUpPage = () => {
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
		confirmPassword: ""
	});
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const { signup, loading } = useUserStore();

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value
		});
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		
		if (formData.password !== formData.confirmPassword) {
			alert("Passwords don't match!");
			return;
		}

 		const userData = {
			name: `${formData.firstName} ${formData.lastName}`.trim(),
			email: formData.email,
			password: formData.password,
			confirmPassword: formData.confirmPassword
		};

		signup(userData);
	};

	return (
		<div style={{
			minHeight: '100vh',
			display: 'flex',
			background: '#fff'
		}}>
 			<div style={{
				flex: 1,
				background: 'linear-gradient(rgba(0,0,0,.1), rgba(0,0,0,0.1)), url(/img/signup-bg.jpg)',
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
						Join Us Today
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
				background: '#fff',
				overflowY: 'auto'
			}}>
				<div style={{
					width: '100%',
					maxWidth: '450px'
				}}>
 					<div style={{
						marginBottom: '40px',
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
							Registration Form
						</h2>
						<p style={{
							color: '#666',
							fontSize: '14px'
						}}>
							Create your account to start shopping
						</p>
					</div>

 					<form onSubmit={handleSubmit}>
						<div style={{
							display: 'grid',
							gridTemplateColumns: '1fr 1fr',
							gap: '20px',
							marginBottom: '25px'
						}}>
							<div>
								<label style={{
									display: 'block',
									fontSize: '12px',
									fontWeight: '600',
									color: '#666',
									marginBottom: '8px',
									textTransform: 'uppercase',
									letterSpacing: '0.5px'
								}}>
									First Name
								</label>
								<input
									type="text"
									name="firstName"
									value={formData.firstName}
									onChange={handleChange}
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

							<div>
								<label style={{
									display: 'block',
									fontSize: '12px',
									fontWeight: '600',
									color: '#666',
									marginBottom: '8px',
									textTransform: 'uppercase',
									letterSpacing: '0.5px'
								}}>
									Last Name
								</label>
								<input
									type="text"
									name="lastName"
									value={formData.lastName}
									onChange={handleChange}
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
						</div>
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
									name="email"
									value={formData.email}
									onChange={handleChange}
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
								Password
							</label>
							<div style={{position: 'relative'}}>
								<input
									type={showPassword ? "text" : "password"}
									name="password"
									value={formData.password}
									onChange={handleChange}
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
									name="confirmPassword"
									value={formData.confirmPassword}
									onChange={handleChange}
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
									<i className={showConfirmPassword ? "fa fa-eye-slash" : "fa fa-lock"} style={{fontSize: '14px'}}></i>
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
									Creating Account...
								</>
							) : (
								<>
									Register
									<i className="fa fa-arrow-right" style={{fontSize: '12px'}}></i>
								</>
							)}
						</button>
					</form>

					 
					<div style={{
						margin: '30px 0',
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
							Already have an account?
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
							Sign In
						</Link>
					</div>
				</div>
			</div>

			
			<style>{`
				@media (max-width: 768px) {
					.signup-page-container > div:first-child {
						display: none !important;
					}
				}
			`}</style>
		</div>
	);
};

export default SignUpPage;