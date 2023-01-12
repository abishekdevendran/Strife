import React, { useState, CSSProperties } from 'react';
import { useTimer } from 'react-timer-hook';

const VerifyButton = ({ user }: any) => {
	const [interactive, setInteractive] = useState(true);
	const [hasFetched, setHasFetched] = useState(false);
	//set time to 2 days from now
	const { seconds, minutes, hours, start, restart } = useTimer({
		expiryTimestamp: new Date(Date.now()),
		autoStart: false,
	});
	const regenerateHandler = async () => {
		setInteractive(false);
		try {
			const res = await fetch('/api/verify/regenerate', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
			});
			const data = await res.json();
			restart(new Date(data.expireAt));
			setHasFetched(true);
			return data;
		} catch (err) {
			console.log(err);
		}
		setInteractive(true);
	};
	return (
		<div>
			{hasFetched && (
				<>
					Verify Cooldown:{' '}
					<span className="countdown font-mono text-2xl">
						<span style={{ '--value': hours } as CSSProperties}></span>:
						<span style={{ '--value': minutes } as CSSProperties}></span>:
						<span style={{ '--value': seconds } as CSSProperties}></span>
					</span>
				</>
			)}
			<button
				onClick={regenerateHandler}
				disabled={!interactive}
				className="btn disabled:btn-disabled btn-sm md:btn-md lg:btn-lg"
			>
				Regenerate
			</button>
		</div>
	);
};

export default VerifyButton;
