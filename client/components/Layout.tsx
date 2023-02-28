import React, { ReactNode, useEffect } from 'react';
import Navbar from './Navbar';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { SocketProvider } from '../contexts/SocketContext';
import ServerLayout from './ServerLayout';

const Layout = ({ children }: { children: ReactNode }) => {
	const router = useRouter();
	return (
		<>
			<Navbar />
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
					key={
						// This is to ensure that page isn't unmounted when navigating between server pages
						router.pathname.startsWith('/server') ? 'server' : router.asPath
					}
				>
					{router.pathname.startsWith('/server') ? (
						<SocketProvider>
							<ServerLayout>{children}</ServerLayout>
						</SocketProvider>
					) : (
						children
					)}
				</motion.main>
			</AnimatePresence>
		</>
	);
};

export default Layout;
