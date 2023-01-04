import { useRouter } from 'next/router';
import React, { useContext, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import useSWRImmutable from 'swr/immutable';
import LoadingPage from '../../../components/LoadingPage';
import UserContext from '../../../contexts/UserContext';

const github = () => {
	//get query object from router
	const router = useRouter();
	const { query, isReady } = router;
	const { mutate: userMutate } = useContext(UserContext);
	const { data, isLoading, error, mutate } = useSWRImmutable(
		'/api/login/oauth/github',
		isReady
			? async () => {
					console.log('query: ', query);
					const res = await fetch(`/api/login/oauth/github?code=${query.code}`);
					if (res.ok) {
						const data = await res.json();
						toast.success(data.message);
						userMutate();
						router.push('/dashboard');
						return;
					}
					if (res.status === 400) {
						toast.error('Something went wrong.');
					}
					if (res.status === 401) {
						toast.error('Login using credentials.');
					}
					if (res.status === 500) {
						toast.error('Server unavailable. Please try again later.');
						router.push('/login');
						return;
					}
					router.push('/login');
			  }
			: null
	);
	useEffect(() => {
		if (isReady) {
			mutate();
		}
	}, [isReady]);
	if (isLoading || !isReady) {
		return <LoadingPage />;
	}
	if (error) {
		toast.error('Something went wrong.');
		router.push('/login');
		return <div>error</div>;
	}
	if (data) {
		console.log(data);
		<div>Success</div>;
	}
	return null;
};

export default github;
