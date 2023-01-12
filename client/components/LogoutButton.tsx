import React, { useContext, useState } from 'react';
import { toast } from 'react-hot-toast';
import UserContext from '../contexts/UserContext';

const LogoutButton = () => {
	const [interactive, setInteractive] = useState(true);
	const { mutate } = useContext(UserContext);
	const onClick = async () => {
		setInteractive(false);
		try {
			const response = await fetch('/api/user/logout', {
				method: 'GET',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
				},
			});
			const result = await response.json();
			if (!response.ok) {
				toast.error(result.message);
				setInteractive(true);
			} else {
				toast.success('Logout successful. Redirecting...');
				mutate();
			}
		} catch (error) {
			toast.error('Something went wrong. Please try again.');
			setInteractive(true);
		}
	};
	return (
		<button
			onClick={onClick}
			disabled={!interactive}
			className={`btn disabled:btn-disabled btn-md lg:btn-lg`}
		>
			Logout
		</button>
	);
};

export default LogoutButton;
