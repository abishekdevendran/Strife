import React, { ReactNode, useEffect } from 'react';
import Navbar from './Navbar';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { SocketProvider } from '../contexts/SocketContext';

const Layout = ({ children }: { children: ReactNode }) => {
	const router = useRouter();
	return (
		<>
			<SocketProvider>
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
						className="motionMain page transition-all duration-300"
						transition={{
							type: 'spring',
							stiffness: 100,
						}}
						key={router.asPath}
					>
						{children}
					</motion.main>
				</AnimatePresence>
			</SocketProvider>
		</>
	);
};

export default Layout;
