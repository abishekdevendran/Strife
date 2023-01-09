import React, { ReactNode } from 'react';
import Navbar from './Navbar';
import { AnimatePresence } from 'framer-motion';

const Layout = ({ children }: { children: ReactNode }) => {
	return (
		<>
			<AnimatePresence exitBeforeEnter initial={false}>
			<Navbar />
			{children}
			</AnimatePresence>
		</>
	);
};

export default Layout;
