import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import useSWRImmutable from 'swr/immutable';
import LoadingPage from '../../components/LoadingPage';

const Token = () => {
	const router = useRouter();
	const { query, isReady } = router;
	const { error, isLoading, mutate } = useSWRImmutable(
		'verify',
		isReady
			? async () => {
					if (!query.token) return;
					const res = await fetch(`/api/verify/${query.token}`);
					const data = await res.json();
					if (!res.ok && data.message) {
						toast.error(data.message);
					}
					if (res.ok) {
						toast.success(`${data.message}, redirecting...`);
						router.push('/dashboard');
					}
					router.push('/login');
					console.log(data);
					return data;
			  }
			: null
	);
	useEffect(() => {
		if (isReady) {
			mutate();
		}
	}, [isReady]);
	if (isLoading || !isReady) return <LoadingPage />;
	if (error) {
		toast.error('Something went wrong.');
		router.push('/login');
		return <div>error</div>;
	}
	return null;
};

export default Token;
