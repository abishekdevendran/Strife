import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/router';
import React, { FC, useContext, useEffect, useState } from 'react';
import UserContext from '../contexts/UserContext';
import IUser from '../types/User';
import LoadingPage from './LoadingPage';

const WithAuth = (Child: any) => {
	const AuthenticatedComponent = () => {
		const router = useRouter();
		const [cachedUser, setCachedUser] = useState<IUser | null>(null);
		const { user, isLoading } = useContext(UserContext);

		useEffect(() => {
			if (!isLoading) {
				if (!user) {
					const redirect = router.asPath;
					router.push({
						pathname: '/login',
						query: redirect ? { redirect } : {},
					});
				} else {
					setCachedUser(user);
				}
			}
		}, [user, isLoading]);
		return (
			<>
				{isLoading && !user && <LoadingPage />}
				{cachedUser && <Child user={cachedUser} />}
			</>
		);
	};
	return AuthenticatedComponent;
};

export default WithAuth;
