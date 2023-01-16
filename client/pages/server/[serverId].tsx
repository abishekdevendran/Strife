import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import LoadingPage from '../../components/LoadingPage';
import useSWR from 'swr';
import IUser from '../../types/User';
import dayjs from 'dayjs';
import Head from 'next/head';
import WithAuth from '../../components/WithAuth';

const serverDashboard = ({ user }: { user: IUser }) => {
	const router = useRouter();
	const { query, isReady } = router;
	if (!isReady) return <LoadingPage />;
	const {
		data: server,
		error,
		isLoading,
	} = useSWR(query ? '/api/server/' + query.serverId : null, async () => {
		if (!query.serverId) return null;
		try {
			const res = await fetch(`/api/server/${query.serverId}`);
			const data = await res.json();
			if (!res.ok && data.message) {
				toast.error(data.message);
				return null;
			}
			console.log(data);
			return data.server;
		} catch (err) {
			toast.error('Server unavailable, please try again later.');
			return null;
		}
	});
	if (isLoading) return <LoadingPage />;
	if (error) return <div>error</div>;
	if (!server) return <div>Server not found</div>;
	return (
		<>
			<Head>
				<title>{`Server ${server.name}`}</title>
				<meta name="description" content="User Dashboard" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
			</Head>
			<div className="card bg-base-200 p-4 mt-20 flex flex-col items-center justify-between gap-4">
				<div className="w-full h-full card bg-base-300 sm:p-8 sm:py-10 p-4 py-6">
					<h2 className="prose text-5xl font-extrabold mb-8 text-center">
						{server.name}
					</h2>
					<div className="mb-10">
						<p>Owner: {/* TODO */}</p>
						<p>Created At: {dayjs(server.createdAt).format('MMMM D, YYYY')}</p>
						<p>isPrivate: {server.isPrivate ? 'True' : 'False'}</p>
					</div>
				</div>
				<div className="w-full h-full card bg-base-300 sm:p-6 sm:py-8 p-4 py-4">
					Hey
				</div>
				<div className="w-full h-full card bg-base-300 sm:p-6 sm:py-8 p-4 py-4">
					Hello
				</div>
			</div>
		</>
	);
};

export default WithAuth(serverDashboard);
