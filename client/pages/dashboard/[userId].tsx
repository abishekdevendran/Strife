import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import useSWRImmutable from 'swr/immutable';
import LoadingPage from '../../components/LoadingPage';
import UserContext from '../../contexts/UserContext';

const friendDashboard = () => {
	const router = useRouter();
	const { query, isReady } = router;
	const { user: me } = useContext(UserContext);
	const {
		data: user,
		error,
		isLoading,
	} = useSWRImmutable(
		isReady ? `/api/user/${query.userId}` : null,
		async () => {
			if (!query.userId) return null;
			if (query.userId === (me as any)._id) {
				toast.error("Too much narcissism, you can't look at your own profile.");
				router.push('/dashboard');
			}
			try {
				const res = await fetch(`/api/user/${query.userId}`);
				const data = await res.json();
				if (!res.ok && data.message) {
					toast.error(data.message);
					return null;
				}
				console.log(data);
				return data.user;
			} catch (err) {
				toast.error('Server unavailable, please try again later.');
				return null;
			}
		}
	);
	if (!me) {
		toast.error('You are not logged in');
		return <div>Redirecting...</div>;
	}
	if (error) return <div>error</div>;
	if (isLoading || !isReady) {
		console.log('loading');
		return <LoadingPage />;
	}
	if (!user) return <div>User not found</div>;
	return (
		<div>
			<h1>Dashboard</h1>
			<p>Username: {user.username}</p>
			<p>Email: {user.email}</p>
			<p>Created At: {user.createdAt}</p>
			<p>Verified: {user.isVerified ? 'True' : 'False'}</p>
			<p>Github ID: {user.githubID}</p>
			{user.isFriend && <p>user.friends</p>}
		</div>
	);
};

friendDashboard.requireAuth = true;
export default friendDashboard;
