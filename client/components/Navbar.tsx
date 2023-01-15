import dynamic from 'next/dynamic';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import UserContext from '../contexts/UserContext';
import LogoutButton from './LogoutButton';
import { toast } from 'react-hot-toast';
import Notifications from './Notifications';

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
	const { user } = useContext(UserContext);
	const themeMenu = useRef<HTMLDivElement>(null);
	const themeMenuButton = useRef<HTMLDivElement>(null);
	const themeHandler = () => {
		// toast.success('Theme changed!');
		switch (theme) {
			case 'pastel':
				setTheme('dark');
				break;
			case 'dark':
				setTheme('valentine');
				break;
			case 'valentine':
				setTheme('night');
				break;
			case 'night':
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
			case 'dark':
				return <BiMoon className="h-full w-full" />;
			case 'valentine':
				return <BiSun className="h-full w-full" />;
			case 'night':
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
		<div className="navbar fixed z-[2] top-0 left-0 bg-base-300 px-8">
			<div className="flex-1 -ml-2">
				<Link className="btn btn-ghost normal-case" href={'/'}>
					<h1 className="text-4xl font-black tracking-tight">Strife</h1>
				</Link>
			</div>
			<div className="flex-none">
				<div onClick={themeHandler}>
					{mounted && (
						<div
							className="tooltip tooltip-left tooltip-success w-10 flex justify-center cursor-pointer hover:scale-110"
							data-tip={theme}
						>
							{themeIcon()}
						</div>
					)}
				</div>
				{user && <Notifications />}
				{user && (
					<div className="dropdown dropdown-end ml-2" ref={themeMenu}>
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
							className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52 transition-all delay-150"
						>
							<li className="justify-between">
								<Link href="/dashboard">Profile</Link>
							</li>
							<li>
								<a>Settings</a>
							</li>
							<li>
								<LogoutButton />
							</li>
						</ul>
					</div>
				)}
			</div>
		</div>
	);
};

export default Navbar;
