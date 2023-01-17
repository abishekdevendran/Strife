import { AnimatePresence } from 'framer-motion';
import React, { ReactNode, useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ServersBar from './ServersBar';
import UserContext from '../contexts/UserContext';
import LoadingPage from './LoadingPage';
import { toast } from 'react-hot-toast';
import IUser from '../types/User';
import { useRouter } from 'next/router';

const ServerLayout = ({ children }: { children: ReactNode }) => {
	const router = useRouter();
	const [cachedUser, setCachedUser] = useState<IUser | null>(null);
	const { user, isLoading } = useContext(UserContext);

	useEffect(() => {
		if (!isLoading) {
			if (!user) {
				console.log('redirecting');
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

	useEffect(() => {
		console.log('ServerLayout useEffect');
	}, []);

	return (
		<AnimatePresence
			initial={false}
			mode="wait"
			onExitComplete={() => window.scrollTo(0, 0)}
		>
			<motion.main
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				className="motionMain page"
				transition={{
					type: 'spring',
					stiffness: 100,
				}}
			>
				{isLoading && <LoadingPage />}
				{!isLoading && user && (
					<>
						<ServersBar user={cachedUser} />
						{children}
					</>
				)}
			</motion.main>
		</AnimatePresence>
	);
};

export default ServerLayout;
