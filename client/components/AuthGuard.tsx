import { useRouter } from 'next/router';
import React, { ReactNode, useContext, useEffect } from 'react';
import UserContext from '../contexts/UserContext';
import LoadingPage from './LoadingPage';

const AuthGuard = ({ children }: { children: ReactNode }) => {
	const router = useRouter();
	const { user, isLoading } = useContext(UserContext);
	useEffect(() => {
		if (!isLoading && !user) {
			const redirect = router.asPath;
			router.push({ pathname: '/login', query: redirect ? { redirect } : {} });
		}
	}, [user, isLoading, router]);
	if (isLoading) {
		return <LoadingPage />;
	}
	if (!isLoading && user) {
		return <>{children}</>;
	}
	return null;
};

export default AuthGuard;
