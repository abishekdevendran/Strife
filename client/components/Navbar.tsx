import dynamic from 'next/dynamic';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';
import Link from 'next/link';

const BiSun = dynamic(
	() =>
		import('react-icons/bi').then((module) => {
			return module.BiSun;
		}),
	{
		loading: () => <p>Loading...</p>,
	}
);
const BiMoon = dynamic(
	() =>
		import('react-icons/bi').then((module) => {
			return module.BiMoon;
		}),
	{
		loading: () => <p>Loading...</p>,
	}
);

const Navbar = () => {
	const [mounted, setMounted] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const { theme, setTheme } = useTheme();
	const themeMenu = useRef<HTMLDivElement>(null);
	const themeMenuButton = useRef<HTMLDivElement>(null);
	//TODO
	const dropDownHelper = (e: React.ChangeEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		const specialTarget = document.querySelector('.special-target')!;
		console.log(document.activeElement);
		if(document.activeElement===specialTarget){
			(document.activeElement as HTMLElement).blur();
		}
		specialTarget.classList.toggle('dropdown-open');
		console.log(e.target);
	}
	const themeHandler = () => {
		console.log(theme);
		switch (theme) {
			case 'pastel':
				setTheme('forest');
				break;
			case 'forest':
				setTheme('black');
				break;
			case 'black':
				setTheme('business');
				break;
			case 'business':
				setTheme('pastel');
				break;
			default:
				setTheme('pastel');
		}
	};
	const themeIcon = () => {
		switch (theme) {
			case 'pastel':
				return <BiSun className="h-full w-full" />;
			case 'forest':
				return <BiMoon className="h-full w-full" />;
			case 'black':
				return <BiSun className="h-full w-full" />;
			case 'business':
				return <BiMoon className="h-full w-full" />;
			default:
				return <BiSun className="h-full w-full" />;
		}
	};

	useEffect(() => setMounted(true), []);
	useEffect(() => {
		if (!isOpen) {
			(document.activeElement as HTMLElement).blur();
		} else if (isOpen && !themeMenu.current?.contains(document.activeElement)) {
			setIsOpen(false);
		}
	}, [isOpen]);
	return (
		<div className="navbar bg-base-100">
			<div className="flex-1">
				<Link className="btn btn-ghost normal-case text-xl" href={'/'}>
					Strife
				</Link>
			</div>
			<div className="flex-none">
				<div
					className="w-10 flex justify-center cursor-pointer hover:scale-110"
					onClick={themeHandler}
				>
					{mounted && themeIcon()}
				</div>
				<div
					className="dropdown dropdown-end"
					ref={themeMenu}
				>
					<div
						tabIndex={0}
						className="btn btn-ghost btn-circle avatar select-none"
						ref={themeMenuButton}
						onBlur={(e) => {
							setIsOpen(false);
						}}
						onClick={(e) => {
							if (isOpen) {
								setIsOpen(false);
							} else {
								setIsOpen(true);
							}
						}}
					>
						<div className="w-10 rounded-full">
							<img src="/defaultAvatar.jpg" />
						</div>
					</div>
					<ul
						tabIndex={0}
						className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
					>
						<li>
							<a className="justify-between">
								Profile
								<span className="badge">New</span>
							</a>
						</li>
						<li>
							<a>Settings</a>
						</li>
						<li>
							<a>Logout</a>
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
};

export default Navbar;
