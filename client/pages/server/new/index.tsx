import Head from 'next/head';
import React, { useContext, useState } from 'react';
import { toast } from 'react-hot-toast';
import WithAuth from '../../../components/WithAuth';
import IUser from '../../../types/User';
import {
	createServerSchema,
	createServerSchemaType,
} from '../../../models/formSchema';
import { useRouter } from 'next/router';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import UserContext from '../../../contexts/UserContext';

const NewServer = ({ user }: { user: IUser }) => {
	const { mutate } = useContext(UserContext);
	const router = useRouter();
	const [interactive, setInteractive] = useState(true);
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<createServerSchemaType>({
		resolver: zodResolver(createServerSchema),
	});
	const submitHandler = async (data: createServerSchemaType) => {
		setInteractive(false);
		try {
			const response = await fetch('/api/server', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			});
			if (!response.ok) {
				if (response.status === 500) {
					toast.error(
						'Server temporarily unavailable. Please try again later.'
					);
					return;
				}
				const result = await response.json();
				toast.error(result.message);
				return;
			}
			toast.success('Server created!');
			mutate();
			router.push('/dashboard');
		} catch (err) {
			toast.error('Server temporarily unavailable. Please try again later.');
		}
	};
	if (!user) {
		//this never happens because of AuthGuard, left here for Typescript to be happy
		toast.error('You are not logged in');
		return <div>Redirecting...</div>;
	}
	return (
		<>
			<Head>
				<title>{`${user.username}'s new Server`}</title>
				<meta name="description" content="New Server creation page." />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
			</Head>
			<div className="card lg:card-side bg-base-300 shadow-xl flex items-center justify-center">
				<h2 className="lg:-rotate-90 card-title  text-5xl lg:text-6xl tracking-tight lg:-mx-12 font-extrabold mt-8 lg:opacity-75 lg:mb-6 pointer-events-none">
					New &nbsp;Server
				</h2>
				<div className="card-body w-96 flex items-center pb-12 px-8">
					<form
						onSubmit={handleSubmit(submitHandler)}
						className="form-control w-full"
					>
						<fieldset
							disabled={!interactive}
							className="form-control w-full flex items-center justify-center"
						>
							<p className="label text-lg mt-4">Username:</p>
							<input
								className="input input-bordered w-full"
								{...register('name')}
							/>
							<p>{errors.name?.message}</p>
							<p className="label text-lg mt-4">Description:</p>
							<input
								className="input input-bordered w-full"
								{...register('description')}
							/>
							<p>{errors.description?.message}</p>
							{/* checkbox for public or private server */}
							<p className="label text-lg mt-4">Public:</p>
							<input
								type="checkbox"
								className="toggle toggle-primary"
								{...register('isPrivate')}
							/>
							<p>{errors.isPrivate?.message}</p>
						</fieldset>
						<span className="w-full grid grid-cols-1 gap-x-4 mt-4">
							<button
								type="submit"
								className="btn btn-primary disabled:btn-disabled btn-md lg:btn-lg"
							>
								Submit
							</button>
						</span>
					</form>
				</div>
			</div>
		</>
	);
};

export default WithAuth(NewServer);
