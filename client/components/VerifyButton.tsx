import React, { useState } from 'react';
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
					Verify Cooldown: {hours}:{minutes}:{seconds}
				</>
			)}
			<button onClick={regenerateHandler} disabled={!interactive}>
				Regenerate
			</button>
		</div>
	);
};

export default VerifyButton;
