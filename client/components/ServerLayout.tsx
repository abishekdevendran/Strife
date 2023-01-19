import { AnimatePresence } from 'framer-motion';
import React, {
	cloneElement,
	Fragment,
	isValidElement,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from 'react';
import { motion } from 'framer-motion';
import ServersBar from './ServersBar';
import UserContext from '../contexts/UserContext';
import LoadingPage from './LoadingPage';
import { toast } from 'react-hot-toast';
import IUser from '../types/User';
import { useRouter } from 'next/router';

//function to take children and prop value, return a clone with prop passed to children
const childrenWithProps = (children: any, user: IUser | null) => {
	return children!.map((child: any, index: number) => {
		if (isValidElement(child)) {
			return (
				<Fragment key={index}>
					{cloneElement(child, { user } as Partial<unknown>)}
				</Fragment>
			);
		}
	});
};

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
				{(isLoading || cachedUser === null) && <LoadingPage />}
				{!isLoading && cachedUser !== null && (
					<>
						<ServersBar user={cachedUser} />
						{childrenWithProps(children, cachedUser)}
					</>
				)}
			</motion.main>
		</AnimatePresence>
	);
};

export default ServerLayout;
