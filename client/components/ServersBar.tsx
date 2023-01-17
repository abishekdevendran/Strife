import dynamic from 'next/dynamic';
import Link from 'next/link';
import React from 'react';
import IUser from '../types/User';

const BsPlus = dynamic(() =>
	import('react-icons/bs').then((mod) => mod.BsPlus)
);

const ServersBar = ({ user }: { user: IUser | null }) => {
	if (!user) return null;
	return (
		<ul className="serverBar absolute left-0 top-[50%] translate-y-[-50%] menu bg-base-200 p-2 rounded-box max-w-xs flex items-center gap-4 py-4 z-10">
			{user.servers!.map((server: any) => {
				const { name, _id, description } = server;
				return (
					<Link
						href={`/server/${_id}`}
						className="h-full w-full flex justify-center"
						key={_id}
					>
						<div className="tooltip tooltip-right after:z-50" data-tip={name}>
							<div className="avatar h-12 w-12 text-center flex justify-center items-center rounded-full bg-base-300 hover:scale-90">
								{name[0].toUpperCase()}
							</div>
						</div>
					</Link>
				);
			})}
			<div className="tooltip tooltip-right" data-tip="New Server">
				<Link
					href={'/server/new'}
					className="btn flex items-center justify-center"
				>
					<BsPlus className="h-full w-full" />
				</Link>
			</div>
		</ul>
	);
};

export default ServersBar;
