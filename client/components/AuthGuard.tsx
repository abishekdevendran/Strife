import { useIsPresent } from 'framer-motion';
import { useRouter } from 'next/router';
import React, { ReactNode, useContext, useEffect, useState } from 'react';
import UserContext from '../contexts/UserContext';
import LoadingPage from './LoadingPage';

const AuthGuard = ({ children }: { children: ReactNode }) => {
	const router = useRouter();
	const [initialized, setInitialized] = useState(false);
	const { user, isLoading } = useContext(UserContext);
	const isPresent = useIsPresent();
	useEffect(() => {
		if (!isLoading && !initialized) {
			if (!user) {
				const redirect = router.asPath;
				router.push({
					pathname: '/login',
					query: redirect ? { redirect } : {},
				});
			}
			setInitialized(true);
		}
	}, [user, isLoading, initialized]);
	if (user) {
		return <>{children}</>;
	}
	if (isLoading) {
		return <LoadingPage />;
	}
	return null;
	//rewrite above logic in conditional rendering
	// return (
	// 	<AnimatePresence>
	// 		<motion.main
	// 			initial={{ opacity: 0 }}
	// 			animate={{ opacity: 1 }}
	// 			exit={{ opacity: 0 }}
	// 			className="motionMain page"
	// 			transition={{
	// 				type: 'spring',
	// 				stiffness: 300,
	// 				damping: 50,
	// 			}}
	// 			key={router.asPath}
	// 		>
	// 			{isLoading ? (
	// 				<LoadingPage key={router.asPath} />
	// 			) : !isLoading && user ? (
	// 				<Fragment key={router.asPath}>{children}</Fragment>
	// 			) : null}
	// 		</motion.main>
	// 	</AnimatePresence>
	// );
};

export default AuthGuard;
