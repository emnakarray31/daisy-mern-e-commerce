import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
import axios from "../lib/axios";

const PeopleAlsoBought = ({ currentProductId, category }) => {
	const [recommendations, setRecommendations] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [itemsPerPage, setItemsPerPage] = useState(4);
	const [isAnimating, setIsAnimating] = useState(false);

	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth < 576) setItemsPerPage(1);
			else if (window.innerWidth < 768) setItemsPerPage(2);
			else if (window.innerWidth < 992) setItemsPerPage(3);
			else setItemsPerPage(4);
		};

		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	useEffect(() => {
		const fetchRecommendations = async () => {
			try {
				setIsLoading(true); 
				const res = await axios.get(`/products/category/${category}`); 
				let products = res.data.products || res.data;
				const filtered = products
					.filter(p => p._id !== currentProductId)
					.slice(0, 12);
				
				setRecommendations(filtered);
			} catch (error) {
				console.error("Error fetching recommendations:", error);
			} finally {
				setIsLoading(false);
			}
		};

		if (category) {
			fetchRecommendations();
		}
	}, [currentProductId, category]);

	const nextSlide = () => {
		if (isAnimating) return;
		setIsAnimating(true);
		setCurrentIndex((prev) => {
			const maxIndex = Math.max(0, recommendations.length - itemsPerPage);
			return Math.min(prev + 1, maxIndex);
		});
		setTimeout(() => setIsAnimating(false), 300);
	};

	const prevSlide = () => {
		if (isAnimating) return;
		setIsAnimating(true);
		setCurrentIndex((prev) => Math.max(0, prev - 1));
		setTimeout(() => setIsAnimating(false), 300);
	};

	const isStartDisabled = currentIndex === 0;
	const isEndDisabled = currentIndex >= recommendations.length - itemsPerPage;
	const showArrows = recommendations.length > 1;  

	if (isLoading) {
		return (
			<section style={{ padding: '60px 0', background: '#f9f9f9' }}>
				<div className="container">
					<div style={{ textAlign: 'center', padding: '40px 0' }}>
						<i className="fa fa-spinner fa-spin" style={{ fontSize: '30px', color: '#e53637' }}></i>
					</div>
				</div>
			</section>
		);
	}

	if (recommendations.length === 0) {
		return null;
	}

	return (
		<section style={{ padding: '80px 0', background: '#f9f9f9' }}>
			<div className="container"> 
				<div className="row">
					<div className="col-lg-12">
						<div style={{ textAlign: 'center', marginBottom: '50px' }}>
							<span style={{
								fontSize: '14px',
								color: '#e53637',
								fontWeight: '700',
								textTransform: 'uppercase',
								letterSpacing: '4px',
								marginBottom: '15px',
								display: 'block'
							}}>
								You May Also Like
							</span>
							<h2 style={{
								fontSize: '36px',
								fontWeight: '700',
								color: '#111',
								margin: '0'
							}}>
								People Also Bought
							</h2>
						</div>
					</div>
				</div>
 
				<div style={{ position: 'relative', padding: showArrows ? '0 50px' : '0 15px' }}> 
					{showArrows && (
						<button
							onClick={prevSlide}
							disabled={isStartDisabled}
							style={{
								position: 'absolute',
								left: '0',
								top: '50%',
								transform: 'translateY(-50%)',
								width: '45px',
								height: '45px',
								borderRadius: '50%',
								border: 'none',
								background: isStartDisabled ? '#e5e5e5' : '#111',
								color: isStartDisabled ? '#999' : '#fff',
								cursor: isStartDisabled ? 'not-allowed' : 'pointer',
								transition: 'all 0.3s',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								zIndex: 10,
								opacity: isStartDisabled ? 0.5 : 1
							}}
							onMouseEnter={(e) => {
								if (!isStartDisabled) {
									e.currentTarget.style.background = '#e53637';
									e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
								}
							}}
							onMouseLeave={(e) => {
								if (!isStartDisabled) {
									e.currentTarget.style.background = '#111';
									e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
								}
							}}
						>
							<i className="fa fa-chevron-left"></i>
						</button>
					)} 
					<div style={{ overflow: 'hidden' }}>
						<div
							style={{
								display: 'flex',
								transition: 'transform 0.3s ease-in-out',
								transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)`
							}}
						>
							{recommendations.map((product) => (
								<div
									key={product._id}
									style={{
										flex: `0 0 ${100 / itemsPerPage}%`,
										padding: '0 15px',
										boxSizing: 'border-box'
									}}
								> 
									<ProductCard product={product} />
								</div>
							))}
						</div>
					</div> 
					{showArrows && (
						<button
							onClick={nextSlide}
							disabled={isEndDisabled}
							style={{
								position: 'absolute',
								right: '0',
								top: '50%',
								transform: 'translateY(-50%)',
								width: '45px',
								height: '45px',
								borderRadius: '50%',
								border: 'none',
								background: isEndDisabled ? '#e5e5e5' : '#111',
								color: isEndDisabled ? '#999' : '#fff',
								cursor: isEndDisabled ? 'not-allowed' : 'pointer',
								transition: 'all 0.3s',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								zIndex: 10,
								opacity: isEndDisabled ? 0.5 : 1
							}}
							onMouseEnter={(e) => {
								if (!isEndDisabled) {
									e.currentTarget.style.background = '#e53637';
									e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
								}
							}}
							onMouseLeave={(e) => {
								if (!isEndDisabled) {
									e.currentTarget.style.background = '#111';
									e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
								}
							}}
						>
							<i className="fa fa-chevron-right"></i>
						</button>
					)}
				</div>
 
				<div style={{ textAlign: 'center', marginTop: '50px' }}>
					<Link
						to={`/category/${category}`}
						className="primary-btn"
						style={{
							display: 'inline-block',
							padding: '15px 40px',
							textTransform: 'capitalize'
						}}
					>
						View More {category}
						<i className="fa fa-arrow-right" style={{ marginLeft: '10px' }}></i>
					</Link>
				</div>
			</div>
		</section>
	);
};

export default PeopleAlsoBought;