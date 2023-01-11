import React from 'react';
import { resolveValue, Toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

const CustomToast = ({ t }: { t: Toast }) => {
	const toastClassMaker = () => {
		let name =
			`btn btn-outline min-w-40 transition-all delay-150 ease-in-out bg-base-200` +
			' '; //ensure gap at end here for concat
		switch (t.type) {
			case 'success':
				name += 'btn-success gap-2';
				break;
			case 'loading':
				name += 'loading';
				break;
			case 'error':
				name += 'btn-error gap-2';
				break;
		}
		return name;
	};
	return (
		<motion.div
			className={toastClassMaker()}
			style={t.style}
			initial={{
				y: '-100%',
			}}
			animate={{
				y: '100%',
			}}
			exit={{
				y: '-200%',
			}}
			transition={{
				type: 'spring',
				stiffness: 300,
				damping: 50,
			}}
		>
			{resolveValue(t.message, t)}
		</motion.div>
	);
};

export default CustomToast;
