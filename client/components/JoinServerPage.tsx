import { useRouter } from 'next/router';
import React, { FormEvent, useContext, useState } from 'react';
import { toast } from 'react-hot-toast';
import UserContext from '../contexts/UserContext';

const JoinServerPage = ({ server, serverId, serverMutate }: any) => {
	const [isDisabled, setIsDisabled] = useState(false);
	const { user, mutate: userMutate } = useContext(UserContext);
	if (!user) {
		toast.error('You must be logged in to join a server');
		return <div>Not logged in</div>;
	}
	const submitHandler = async (e: FormEvent) => {
		e.preventDefault();
		setIsDisabled(true);
		try {
			//serverID is in body of fetch request
			const res = await fetch('/api/server/join', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ serverId }),
			});
			const data = await res.json();
			if (!res.ok && data.message) {
				setIsDisabled(false);
				toast.error(data.message);
			}
			if (res.ok) {
				toast.success(data.message);
				serverMutate();
				userMutate();
			}
		} catch (err) {
			console.log(err);
			toast.error(err as string);
		}
	};
	return (
		<div className="container card mx-4 ml-32 bg-base-200 p-4 mt-20 flex flex-col items-center justify-between gap-4">
			<div className="w-full h-full card bg-base-300 sm:p-8 sm:py-10 p-4 py-6">
				<h2 className=" text-5xl font-extrabold mb-8 text-center">
					{server.name}
				</h2>
				<form className="form-control w-full" onSubmit={submitHandler}>
					<fieldset
						disabled={isDisabled}
						className="form-control w-full flex flex-row items-center justify-center"
					>
						<button
							type="submit"
							className="btn btn-outline btn-success disabled:btn-disabled btn-md bg-base-300 ml-8"
						>
							Join!
						</button>
					</fieldset>
				</form>
			</div>
		</div>
	);
};

export default JoinServerPage;
