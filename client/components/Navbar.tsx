import dynamic from 'next/dynamic';
import React, { useContext } from 'react';
import ThemeContext from '../contexts/ThemeContext';
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
	const { theme, toggleTheme } = useContext(ThemeContext);
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
	return (
		<div className="navbar bg-base-100">
			<div className="flex-1">
				<a className="btn btn-ghost normal-case text-xl">Strife</a>
			</div>
			<div className="flex-none">
				<div className="w-10 flex justify-center cursor-pointer hover:scale-110" onClick={toggleTheme}>
					{themeIcon()}
				</div>
				<div className="dropdown dropdown-end">
					<label tabIndex={0} className="btn btn-ghost btn-circle avatar">
						<div className="w-10 rounded-full">
							<img src="/defaultAvatar.jpg" />
						</div>
					</label>
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
