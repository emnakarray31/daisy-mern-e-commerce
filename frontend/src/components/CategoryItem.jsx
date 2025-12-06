import { Link } from "react-router-dom";

const CategoryItem = ({ category }) => {
	return (
		<Link
			to={category.href}
			style={{
				display: 'block',
				position: 'relative',
				borderRadius: '12px',
				overflow: 'hidden',
				height: '280px',
				boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
				transition: 'all 0.4s ease',
				textDecoration: 'none'
			}}
			onMouseEnter={(e) => {
				e.currentTarget.style.transform = 'translateY(-8px)';
				e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.2)';
				e.currentTarget.querySelector('img').style.transform = 'scale(1.1)';
				e.currentTarget.querySelector('.category-overlay').style.opacity = '0.7';
			}}
			onMouseLeave={(e) => {
				e.currentTarget.style.transform = 'translateY(0)';
				e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
				e.currentTarget.querySelector('img').style.transform = 'scale(1)';
				e.currentTarget.querySelector('.category-overlay').style.opacity = '0.4';
			}}
		>
		 
			<img
				src={category.imageUrl}
				alt={category.name}
				style={{
					width: '100%',
					height: '100%',
					objectFit: 'cover',
					transition: 'transform 0.5s ease'
				}}
			/>

		 
			<div
				className="category-overlay"
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0) 100%)',
					opacity: 0.4,
					transition: 'opacity 0.4s ease'
				}}
			/>

		 
			<div style={{
				position: 'absolute',
				bottom: 0,
				left: 0,
				right: 0,
				padding: '30px 25px',
				color: '#fff',
				zIndex: 2
			}}>
			 
				<h3 style={{
					fontSize: '24px',
					fontWeight: '700',
					marginBottom: '10px',
					textTransform: 'uppercase',
					letterSpacing: '1px',
					textShadow: '0 2px 10px rgba(0,0,0,0.5)',
					color: '#ffffff'
				}}>
					{category.name}
				</h3>
 
				<div style={{
					display: 'inline-flex',
					alignItems: 'center',
					gap: '8px',
					fontSize: '14px',
					fontWeight: '600',
					color: '#fff',
					background: 'rgba(255,255,255,0.2)',
					padding: '8px 16px',
					borderRadius: '4px',
					backdropFilter: 'blur(5px)',
					transition: 'all 0.3s'
				}}>
					Shop Now
					<i className="fa fa-arrow-right" style={{ fontSize: '12px' }}></i>
				</div>
			</div>

		 
			{category.productCount !== undefined && (
				<div style={{
					position: 'absolute',
					top: '15px',
					right: '15px',
					background: '#e53637',
					color: '#fff',
					padding: '6px 12px',
					borderRadius: '20px',
					fontSize: '12px',
					fontWeight: '700',
					boxShadow: '0 2px 10px rgba(229, 54, 55, 0.4)'
				}}>
					{category.productCount} items
				</div>
			)}
		</Link>
	);
};

export default CategoryItem;