import React, { ReactElement } from 'react';
import { resolveValue, Toast } from 'react-hot-toast';

const CustomToast = ({ t }: { t: Toast }) => {
	const toastClassMaker = () => {
		let name = `btn btn-outline no-animation min-w-40 transition-all delay-150 ease-in-out`;
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
	return <div className={toastClassMaker()} style={t.style}>{resolveValue(t.message, t)}</div>;
};

export default CustomToast;
