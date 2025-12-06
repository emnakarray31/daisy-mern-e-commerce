const LoadingSpinner = () => {
	return (
		<div style={{
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			minHeight: '100vh',
			width: '100%',
			position: 'fixed',
			top: 0,
			left: 0,
			background: 'linear-gradient(135deg, #faf8f5 0%, #f5f0ea 100%)',
			zIndex: 9999,
		}}>
			<div style={{
				position: 'relative',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
			}}> 
				<div className='spinner-wrapper'> 
					<div className='spinner-ring ring-1'></div> 
					<div className='spinner-ring ring-2'></div>
					<div className='spinner-ring ring-3'></div>
					<div className='spinner-center'>
						<div className='center-pulse'></div>
					</div>
				</div>
				<div style={{ marginTop: '48px', textAlign: 'center' }}>
					<h2 style={{
						margin: '0 0 12px 0',
						fontSize: '28px',
						fontWeight: '700',
						letterSpacing: '1px',
						fontFamily: 'Playfair Display, serif',
						background: 'linear-gradient(135deg, #895129 0%, #d4a574 100%)',
						WebkitBackgroundClip: 'text',
						WebkitTextFillColor: 'transparent',
						backgroundClip: 'text',
					}}>
						Daisy and More
					</h2>
					<div className='loading-text'>
						<span>L</span>
						<span>O</span>
						<span>A</span>
						<span>D</span>
						<span>I</span>
						<span>N</span>
						<span>G</span>
					</div>
				</div>

				<div style={{ 
					position: 'absolute',
					width: '1px',
					height: '1px',
					padding: 0,
					margin: '-1px',
					overflow: 'hidden',
					clip: 'rect(0, 0, 0, 0)',
					whiteSpace: 'nowrap',
					border: 0,
				}}>Loading</div>
			</div>

			<style>{`
				/* Spinner wrapper */
				.spinner-wrapper {
					position: relative;
					width: 120px;
					height: 120px;
				}

				/* Base ring style */
				.spinner-ring {
					position: absolute;
					border-radius: 50%;
					border: 4px solid transparent;
				}

				/* Ring 1 - Outer (Marron) */
				.ring-1 {
					inset: 0;
					border-top-color: #895129;
					border-right-color: #895129;
					animation: spin 1.5s linear infinite;
					box-shadow: 0 0 10px rgba(137, 81, 41, 0.1) inset;
				}

				/* Ring 2 - Middle (Beige) */
				.ring-2 {
					inset: 15px;
					border-top-color: #d4a574;
					border-left-color: #d4a574;
					animation: spin-reverse 2s linear infinite;
					box-shadow: 0 0 10px rgba(212, 165, 116, 0.1) inset;
				}

				/* Ring 3 - Inner (Marron foncé) */
				.ring-3 {
					inset: 30px;
					border-top-color: #6f3f1f;
					border-right-color: #6f3f1f;
					animation: spin 2.5s linear infinite;
					box-shadow: 0 0 10px rgba(111, 63, 31, 0.1) inset;
				}

				/* Center dot - MARRON au lieu de jaune */
				.spinner-center {
					position: absolute;
					inset: 45px;
					border-radius: 50%;
					background: linear-gradient(135deg, #895129 0%, #6f3f1f 100%);
					box-shadow: 
						0 4px 12px rgba(137, 81, 41, 0.3),
						0 2px 4px rgba(255, 255, 255, 0.2) inset;
					animation: center-pulse 2s ease-in-out infinite;
				}

				/* Center pulse effect - MARRON */
				.center-pulse {
					position: absolute;
					inset: -10px;
					border-radius: 50%;
					border: 2px solid #d4a574;
					opacity: 0;
					animation: pulse-wave 2s ease-out infinite;
				}

				/* Loading text animation */
				.loading-text {
					display: flex;
					gap: 2px;
					justify-content: center;
					font-size: 11px;
					font-weight: 700;
					letter-spacing: 3px;
					color: #6f6f6f;
				}

				.loading-text span {
					display: inline-block;
					animation: letter-wave 1.5s ease-in-out infinite;
				}

				.loading-text span:nth-child(1) { animation-delay: 0s; }
				.loading-text span:nth-child(2) { animation-delay: 0.1s; }
				.loading-text span:nth-child(3) { animation-delay: 0.2s; }
				.loading-text span:nth-child(4) { animation-delay: 0.3s; }
				.loading-text span:nth-child(5) { animation-delay: 0.4s; }
				.loading-text span:nth-child(6) { animation-delay: 0.5s; }
				.loading-text span:nth-child(7) { animation-delay: 0.6s; }

				/* Animations */
				@keyframes spin {
					0% { transform: rotate(0deg); }
					100% { transform: rotate(360deg); }
				}

				@keyframes spin-reverse {
					0% { transform: rotate(360deg); }
					100% { transform: rotate(0deg); }
				}

				@keyframes center-pulse {
					0%, 100% {
						transform: scale(1);
						box-shadow: 
							0 4px 12px rgba(137, 81, 41, 0.3),
							0 2px 4px rgba(255, 255, 255, 0.2) inset;
					}
					50% {
						transform: scale(1.15);
						box-shadow: 
							0 6px 16px rgba(137, 81, 41, 0.4),
							0 2px 4px rgba(255, 255, 255, 0.2) inset;
					}
				}

				@keyframes pulse-wave {
					0% {
						transform: scale(0.8);
						opacity: 1;
					}
					100% {
						transform: scale(1.8);
						opacity: 0;
					}
				}

				@keyframes letter-wave {
					0%, 100% {
						transform: translateY(0px);
						color: #6f6f6f;
					}
					50% {
						transform: translateY(-5px);
						color: #895129;
					}
				}
			`}</style>
		</div>
	);
};

export default LoadingSpinner;