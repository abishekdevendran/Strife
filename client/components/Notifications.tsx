import dynamic from 'next/dynamic';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import useSWR from 'swr';

const MdOutlineNotificationsNone = dynamic(
	() =>
		import('react-icons/md').then((module) => {
			return module.MdOutlineNotificationsNone;
		}),

	{
		loading: () => <p>Loading...</p>,
	}
);

//function to count the number of notifications in all types of alerts
const countNotifications = (notifications: any) => {
	let count = 0;
	notifications.forEach((notification: any) => {
		notification.forEach((n: any) => {
			count++;
		});
	});
	return count;
};

const renderNotifications = (notifications: any) => {
	notifications.forEach((notification: any) => {
		return notification.forEach((n: any) => {
			return (
				<li>
					<Link href={n.link}>
						<a className="btn">{n.message}</a>
					</Link>
				</li>
			);
		});
	});
	return <div className="btn">No New Notifications</div>;
};

const Notifications = () => {
	const [isOpen, setIsOpen] = useState(false);
	const themeMenu = useRef<HTMLDivElement>(null);
	const themeMenuButton = useRef<HTMLDivElement>(null);
	const [alertsCount, setAlertsCount] = useState(-1);
	const {
		data: notifications,
		isLoading,
		error,
	} = useSWR('/api/user/alerts', async () => {
		try {
			const res = await fetch('/api/user/alerts');
			const data = await res.json();
			return data;
		} catch (err) {
			console.log(err);
		}
	});
	useEffect(() => {
		if (!isOpen) {
			(document.activeElement as HTMLElement).blur();
		} else if (isOpen && !themeMenu.current?.contains(document.activeElement)) {
			setIsOpen(false);
		}
	}, [isOpen]);
	useEffect(() => {
		if (!notifications) return;
		if (notifications.length > 0) {
			if (alertsCount < 0) {
				setAlertsCount(countNotifications(notifications));
				return;
			}
		}
		if (alertsCount >= 0) {
			setAlertsCount(-1);
		}
	}, [notifications]);
	return (
		<div className="dropdown dropdown-end ml-2 static" ref={themeMenu}>
			<div
				tabIndex={0}
				className={'select-none'}
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
				<div className="ml-2 w-10 flex justify-center cursor-pointer hover:scale-110">
					<MdOutlineNotificationsNone className="h-full w-full" />
					{!isLoading && notifications && <div>{notifications.length}</div>}
				</div>
			</div>
			<ul
				tabIndex={0}
				className="menu dropdown-content max-md:absolute max-md:left-1/2 max-md:translate-x-[-50%] mt-3 p-2 shadow bg-base-100 rounded-box w-96 transition-all delay-150"
			>
				{alertsCount <= 0 ? (
					<div className="btn">No New Notifications</div>
				) : (
					renderNotifications(notifications)
				)}
			</ul>
		</div>
	);
};

export default Notifications;
