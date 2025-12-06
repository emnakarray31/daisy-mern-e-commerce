import { Link } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";
import { useState, useEffect } from "react";
import LogoutModal from './Logoutmodal';
import SimpleSearchOverlay from './SimpleSearchOverlay';
import CartDropdown from './CartDropdown';
import { useActiveSales } from '../hooks/useActiveSales';
const Navbar = () => {
	const { user, logout } = useUserStore();
	const isAdmin = user?.role === "admin";
	const { cart } = useCartStore();
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [isSearchOpen, setIsSearchOpen] = useState(false);
	const [showLogoutModal, setShowLogoutModal] = useState(false);
	const { hasActiveSales } = useActiveSales();
	useEffect(() => {
		const handleClickOutside = (e) => {
			if (isSidebarOpen && !e.target.closest('.offcanvas-menu-wrapper') && !e.target.closest('.canvas__open')) {
				setIsSidebarOpen(false);
			}
		};
		document.addEventListener('click', handleClickOutside);
		return () => document.removeEventListener('click', handleClickOutside);
	}, [isSidebarOpen]);
	return (
		<> 
			<div 
				className={`offcanvas-menu-overlay ${isSidebarOpen ? 'active' : ''}`}
				onClick={() => setIsSidebarOpen(false)}
			/> 
			<div className={`offcanvas-menu-wrapper ${isSidebarOpen ? 'active' : ''}`}>
				<div className="offcanvas__option">
					<div className="offcanvas__links">
						{user ? (
							<>
								<Link to="/account" onClick={() => setIsSidebarOpen(false)}>My Account</Link>
								<Link to="/my-coupons" onClick={() => setIsSidebarOpen(false)}>My Coupons</Link>
								<button onClick={() => { logout(); setIsSidebarOpen(false); }} style={{background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'inherit', fontSize: 'inherit'}}>
									Sign Out
								</button>
							</>
						) : (
							<>
								<Link to="/login" onClick={() => setIsSidebarOpen(false)}>Sign in</Link>
								<Link to="/signup" onClick={() => setIsSidebarOpen(false)}>Sign up</Link>
							</>
						)}
					</div>
				</div>

				<div className="offcanvas__nav__option">
					<button 
						onClick={() => setIsSearchOpen(true)}
						style={{background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginRight: '15px'}}
					>
						<i className="fa fa-search" style={{fontSize: '20px', color: '#111'}}></i>
					</button>
					<Link to="/wishlist" onClick={() => setIsSidebarOpen(false)} style={{marginRight: '15px'}}>
						<i className="fa fa-heart-o" style={{fontSize: '20px', color: '#111'}}></i>
					</Link>
					{user && (
						<>
							<Link to="/my-coupons" onClick={() => setIsSidebarOpen(false)} style={{marginRight: '15px'}}>
								<i className="fa fa-ticket" style={{fontSize: '20px', color: '#111'}}></i>
							</Link>
							<Link to="/cart" onClick={() => setIsSidebarOpen(false)} style={{position: 'relative', marginRight: '15px'}}>
								<i className="fa fa-shopping-bag" style={{fontSize: '20px', color: '#111'}}></i>
								{cart.length > 0 && <span>{cart.length}</span>}
							</Link>
						</>
					)}
					{cart.length > 0 && <div className="price">${cart.reduce((acc, item) => acc + (item.price * item.quantity), 0).toFixed(2)}</div>}
				</div>

				<nav className="mobile-menu" style={{marginTop: '25px'}}>
					<ul style={{listStyle: 'none', padding: 0, margin: 0}}>
						<li><Link to="/" onClick={() => setIsSidebarOpen(false)} style={{display: 'block', padding: '10px 0', color: '#111', fontSize: '14px', fontWeight: '700', textTransform: 'uppercase'}}>Home</Link></li>
						<li><Link to="/category/jeans" onClick={() => setIsSidebarOpen(false)} style={{display: 'block', padding: '10px 0', color: '#111', fontSize: '14px'}}>Jeans</Link></li>
						<li><Link to="/category/t-shirts" onClick={() => setIsSidebarOpen(false)} style={{display: 'block', padding: '10px 0', color: '#111', fontSize: '14px'}}>T-Shirts</Link></li>
						<li><Link to="/category/shoes" onClick={() => setIsSidebarOpen(false)} style={{display: 'block', padding: '10px 0', color: '#111', fontSize: '14px'}}>Shoes</Link></li>
						<li><Link to="/category/glasses" onClick={() => setIsSidebarOpen(false)} style={{display: 'block', padding: '10px 0', color: '#111', fontSize: '14px'}}>Glasses</Link></li>
						<li><Link to="/category/jackets" onClick={() => setIsSidebarOpen(false)} style={{display: 'block', padding: '10px 0', color: '#111', fontSize: '14px'}}>Jackets</Link></li>
						<li><Link to="/category/suits" onClick={() => setIsSidebarOpen(false)} style={{display: 'block', padding: '10px 0', color: '#111', fontSize: '14px'}}>Suits</Link></li>
						<li><Link to="/category/bags" onClick={() => setIsSidebarOpen(false)} style={{display: 'block', padding: '10px 0', color: '#111', fontSize: '14px'}}>Bags</Link></li>
						<li><Link to="/category/accessories" onClick={() => setIsSidebarOpen(false)} style={{display: 'block', padding: '10px 0', color: '#111', fontSize: '14px'}}>Accessories</Link></li>
						
						<li><Link to="/sales">
						<span style={{ color: '#e53637', fontWeight: '700' }}>
							<i className="fa fa-bolt"></i> Sales
						</span>
						</Link></li>

						{isAdmin && (
							<li><Link to="/admin/dashboard" onClick={() => setIsSidebarOpen(false)} style={{display: 'block', padding: '10px 0', color: '#e53637', fontSize: '14px', fontWeight: '700'}}>Admin Dashboard</Link></li>
						)}
					</ul>
				</nav>

				<div className="offcanvas__text">
					<p>Free shipping, 30-day return or refund guarantee.</p>
				</div>
			</div> 
			<header className="header">
				<div className="header__top">
					<div className="container">
						<div className="row">
							<div className="col-lg-6 col-md-7">
								<div className="header__top__left">
									<p>Free shipping, 30-day return or refund guarantee.</p>
								</div>
							</div>
							<div className="col-lg-6 col-md-5">
								<div className="header__top__right">
									<div className="header__top__links">
										{user ? (
											<>
												<Link to="/account">My Account</Link>
												<Link to="/my-coupons">My Coupons</Link>
												<button 
													onClick={() => setShowLogoutModal(true)}
													style={{background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'inherit', fontSize: 'inherit'}}
												>
													Sign Out
												</button>
												<LogoutModal 
													isOpen={showLogoutModal}
													onClose={() => setShowLogoutModal(false)}
													onConfirm={logout}
												/>
											</>
										) : (
											<>
												<Link to="/login">Sign in</Link>
												<Link to="/signup">Sign up</Link>
											</>
										)}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="container">
					<div className="row">
						<div className="col-lg-3 col-md-3">
							<div className="header__logo">
								<Link to="/">
									<h2 style={{margin: 0, fontSize: '28px', fontWeight: '700', color: '#111'}}>
										Daisy <span style={{color: '#e53637'}}>and</span> More
									</h2>
								</Link>
							</div>
						</div>
						<div className="col-lg-6 col-md-6">
							<nav className="header__menu mobile-menu">
								<ul>
									<li className="active"><Link to="/">Home</Link></li>
									<li>
										<Link to="/category/all">Shop</Link>
									<ul className="dropdown">
									<li><Link to="/category/jeans">Jeans</Link></li>
									<li><Link to="/category/t-shirts">T-Shirts</Link></li>
									<li><Link to="/category/shoes">Shoes</Link></li>
									<li><Link to="/category/glasses">Glasses</Link></li>
									<li><Link to="/category/jackets">Jackets</Link></li>
									<li><Link to="/category/suit">Suits</Link></li>
									<li><Link to="/category/bags">Bags</Link></li>
									<li><Link to="/category/accessories">Accessories</Link></li> 
									{hasActiveSales && (
										<li><Link to="/sales">
										<span style={{
											color: '#e53637',
											fontWeight: '700',
											display: 'flex',
											alignItems: 'center',
											gap: '5px'
										}}>
											<i className="fa fa-bolt"></i> Sales & Discounts
										</span>
										</Link></li>
									)}
									</ul>
									</li>
									{isAdmin && <li><Link to="/secret-dashboard">Admin</Link></li>}
								</ul>
							</nav>
						</div>
						<div className="col-lg-3 col-md-3">
							<div className="header__nav__option"> 
								<button 
									onClick={() => setIsSearchOpen(true)}
									className="search-switch"
									style={{background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginRight: '20px'}}
								>
									<i className="fa fa-search" style={{fontSize: '20px', color: '#111'}}></i>
								</button> 
								<SimpleSearchOverlay 
									isOpen={isSearchOpen}
									onClose={() => setIsSearchOpen(false)}
								/>
 
								<Link to="/wishlist" style={{marginRight: '20px', position: 'relative'}}>
									<i className="fa fa-heart-o" style={{fontSize: '20px', color: '#111'}}></i>
								</Link>
 
								{user && (
									<Link 
										to="/my-coupons" 
										style={{marginRight: '20px', position: 'relative'}}
										title="My Coupons"
									>
										<i className="fa fa-ticket" style={{fontSize: '20px', color: '#111'}}></i>
									</Link>
								)} 
								{user && (
									<div 
										className="cart-icon-wrapper"
										style={{
											position: 'relative',
											display: 'inline-block',
											marginRight: '20px'
										}}
									>
										<Link to="/cart" style={{position: 'relative'}}>
											<i className="fa fa-shopping-bag" style={{fontSize: '20px', color: '#111'}}></i>
											{cart.length > 0 && (
												<span style={{
													position: 'absolute',
													top: '-8px',
													right: '-8px',
													background: '#e53637',
													color: '#fff',
													width: '18px',
													height: '18px',
													borderRadius: '50%',
													fontSize: '11px',
													fontWeight: '700',
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center'
												}}>
													{cart.length}
												</span>
											)}
										</Link> 
										<CartDropdown />
									</div>
								)} 
								{cart.length > 0 && (
									<div className="price" style={{
										fontSize: '14px',
										fontWeight: '700',
										color: '#111'
									}}>
										${cart.reduce((acc, item) => acc + (item.price * item.quantity), 0).toFixed(2)}
									</div>
								)}
							</div>
						</div>
					</div>
					<div 
						className="canvas__open"
						onClick={(e) => {
							e.stopPropagation();
							setIsSidebarOpen(!isSidebarOpen);
						}}
					>
						<i className="fa fa-bars"></i>
					</div>
				</div>
			</header>

			<style>{`
				.cart-icon-wrapper:hover .cart-dropdown {
					opacity: 1 !important;
					visibility: visible !important;
					pointer-events: auto !important;
				}
			`}</style>
		</>
	);
};

export default Navbar;