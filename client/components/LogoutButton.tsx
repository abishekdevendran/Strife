import { useRouter } from 'next/router';
import React, { useContext, useState } from 'react';
import { toast } from 'react-hot-toast';
import UserContext from '../contexts/UserContext';

const LogoutButton = () => {
	const router = useRouter();
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
			} else {
				toast.success('Logout successful. Redirecting...');
				mutate();
				router.push('/login');
			}
		} catch (error) {
			toast.error('Something went wrong. Please try again.');
		}
		setInteractive(true);
	};
	return (
		<button
			onClick={onClick}
			disabled={!interactive}
			className={`btn disabled:btn-disabled btn-sm md:btn-md lg:btn-lg`}
		>
			Logout
		</button>
	);
};

export default LogoutButton;
