import React from 'react';

const LoadingPage = () => {
	return (
		<>
			<div className="page min-h-full flex items-center justify-center">
				<div className='card bg-base-300 p-12'>
					<div>Loading...</div>
					<progress className="progress progress-primary w-56"></progress>
				</div>
			</div>
		</>
	);
};

export default LoadingPage;
