import React from 'react';

const LoadingPage = () => {
	return (
		<>
			<div className="page">
				<div className='card bg-base-300 p-12'>
					<div>Loading...</div>
					<progress className="progress progress-primary w-56"></progress>
				</div>
			</div>
		</>
	);
};

export default LoadingPage;
