import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import LoadingPage from '../../components/LoadingPage';
import useSWRImmutable from 'swr/immutable';
import IUser from '../../types/User';
import dayjs from 'dayjs';
import Head from 'next/head';
import ChatBar from '../../components/ChatBar';
import JoinServerPage from '../../components/JoinServerPage';

const serverDashboard = ({ user }: { user: IUser }) => {
	const [cachedServer, setCachedServer] = useState<any>(null);
	const [isMember, setIsMember] = useState<boolean>(false);
	const router = useRouter();
	const { query, isReady } = router;
	if (!isReady) return <LoadingPage />;
	const {
		data: server,
		error,
		isLoading,
		mutate,
	} = useSWRImmutable(
		query ? '/api/server/' + query.serverId : null,
		async () => {
			if (!query.serverId) return null;
			try {
				const res = await fetch(`/api/server/${query.serverId}`);
				const data = await res.json();
				if (!res.ok && data.message) {
					toast.error(data.message);
					return null;
				}
				console.log(data);
				//if user is a part of server, set isMember to true
				const bool = data.server.users.some((a: any) => {
					return a.user === user._id;
				});
				bool ? setIsMember(true) : setIsMember(false);
				return data.server;
			} catch (err) {
				console.log(err);
				toast.error('Server unavailable, please try again later.');
				return null;
			}
		}
	);
	useEffect(() => {
		if (server) setCachedServer(server);
	}, [server]);
	if (isLoading) return <LoadingPage />;
	if (error) return <div>error</div>;
	if (!cachedServer) return <div>Server not found</div>;
	return (
		<>
			<Head>
				<title>{`Server ${cachedServer.name}`}</title>
				<meta name="description" content="User Dashboard" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
			</Head>
			{!isMember && isReady && (
				<JoinServerPage
					server={cachedServer}
					serverId={query.serverId}
					serverMutate={mutate}
				/>
			)}
			{isMember && (
				<div className="container card mx-4 ml-32 bg-base-200 p-4 mt-20 flex flex-col items-center justify-between gap-4">
					<div className="w-full h-full card bg-base-300 sm:p-8 sm:py-10 p-4 py-6">
						<h2 className=" text-5xl font-extrabold mb-8 text-center">
							{cachedServer.name}
						</h2>
						<div className="mb-10">
							<p>Owner: {cachedServer.owner.username}</p>
							<p>
								Created At:{' '}
								{dayjs(cachedServer.createdAt).format('MMMM D, YYYY')}
							</p>
							<p>isPrivate: {cachedServer.isPrivate ? 'True' : 'False'}</p>
						</div>
					</div>
					<div className="w-full h-full card bg-base-300 sm:p-6 sm:py-8 p-4 py-4">
						<ChatBar />
					</div>
					<div className="w-full h-full card bg-base-300 sm:p-6 sm:py-8 p-4 py-4">
						Hello
					</div>
				</div>
			)}
		</>
	);
};

// serverDashboard.getLayout = (page: any) => {
// 	return <ServerLayout>{page}</ServerLayout>
// }
export default serverDashboard;
