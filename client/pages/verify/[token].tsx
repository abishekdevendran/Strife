import { useRouter } from 'next/router';
import React, { useContext, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import useSWRImmutable from 'swr/immutable';
import LoadingPage from '../../components/LoadingPage';
import WithAuth from '../../components/WithAuth';
import UserContext from '../../contexts/UserContext';

const Token = () => {
	const router = useRouter();
	const { query, isReady } = router;
	const { mutate: userMutate } = useContext(UserContext);
	const { error, isLoading } = useSWRImmutable(
		isReady ? 'verify' : null,
		async () => {
			if (!query.token) return;
			const res = await fetch(`/api/verify/${query.token}`);
			const data = await res.json();
			if (!res.ok && data.message) {
				toast.error(data.message);
			}
			if (res.ok) {
				toast.success(`${data.message}, redirecting...`);
				userMutate();
				router.push('/dashboard');
			}
			router.push('/login');
			console.log(data);
			return data;
		}
	);
	if (isLoading || !isReady) return <LoadingPage />;
	if (error) {
		toast.error('Something went wrong.');
		router.push('/login');
		return <div>error</div>;
	}
	return null;
};

export default WithAuth(Token);
