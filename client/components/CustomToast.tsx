import React, { useEffect } from 'react';
import { resolveValue, Toast, toast } from 'react-hot-toast';
import { IoCloseSharp } from 'react-icons/io5';
import { motion } from 'framer-motion';

const CustomToast = ({ t }: { t: Toast }) => {
	useEffect(() => {
		console.log(t.style);
	}, []);
	const toastClassMaker = () => {
		let name =
			`alert shadow-lg w-64 min-w-40 flex px-4 py-2 bg-neutral text-accent` + ' '; //ensure gap at end here for concat
		switch (t.type) {
			case 'success':
				name += 'btn-success';
				break;
			case 'loading':
				name += 'loading';
				break;
			case 'error':
				name += 'btn-error';
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
				y: t.visible ? '0%' : '-200%',
				opacity: t.visible ? 1 : 0,
			}}
			exit={{ opacity: 0, y: '-200%' }}
		>
			{resolveValue(t.message, t)}
			<button
				className="btn rounded-btn btn-outline border-accent"
				onClick={() => toast.dismiss(t.id)}
			>
				<IoCloseSharp className="fill-accent" />
			</button>
		</motion.div>
	);
};

export default CustomToast;
