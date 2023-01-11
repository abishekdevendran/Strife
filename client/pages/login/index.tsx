import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginFormSchema, loginFormSchemaType } from '../../models/formSchema';
import { toast } from 'react-hot-toast';
import CryptoJS from 'crypto-js';
import { useRouter } from 'next/router';
import Head from 'next/head';
import UserContext from '../../contexts/UserContext';
import GithubOAuth from '../../components/GithubOAuth';
import LoadingPage from '../../components/LoadingPage';

const Login = () => {
	const secretKey = process.env.NEXT_PUBLIC_COUPLING_SECRET;
	const [interactive, setInteractive] = useState(true);
	const { mutate, user, isLoading } = useContext(UserContext);
	const router = useRouter();
	const { query, isReady } = router;

	useEffect(() => {
		if (isReady) {
			if (user) {
				if (query.redirect) {
					console.log(query.redirect);
					router.push(query.redirect as string);
					return;
				}
				router.push('/dashboard');
			}
		}
	}, [user, isReady, query]);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<loginFormSchemaType>({
		resolver: zodResolver(loginFormSchema),
	});

	const submitHandler = async (data: loginFormSchemaType) => {
		setInteractive(false);
		//encrypt password
		data.password = CryptoJS.AES.encrypt(data.password, secretKey!).toString();
		try {
			const response = await fetch('/api/login', {
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
				console.error(result);
				toast.error(result.message);
			} else {
				toast.success('Login successful. Redirecting...');
				router.push('/dashboard');
				mutate();
			}
		} catch (error) {
			console.error(error);
		}
		setInteractive(true);
	};
	if (isLoading) return <LoadingPage />;
	return (
		<>
			<Head>
				<title>Strife Login</title>
				<meta name="description" content="Strife Login" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
			</Head>
			<div className="card w-96 flex items-center bg-base-300 py-12 px-8 mt-2">
				<h2 className="prose text-5xl font-extrabold mb-8">Login</h2>
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
							{...register('username')}
							type="text"
							className="input w-full"
						/>
						<p>{errors.username?.message}</p>
						<p className="label text-lg mt-4">Password:</p>
						<input
							{...register('password')}
							type="password"
							className="input w-full"
						/>
						<p>{errors.password?.message}</p>
						<span className="w-full grid grid-cols-2 gap-x-4 mt-4">
							<button
								type="submit"
								className="btn btn-primary disabled:btn-disabled"
							>
								Submit
							</button>
							<button
								type="reset"
								className="btn btn-outline disabled:btn-disabled"
								onClick={() => router.push('/register')}
							>
								Register
							</button>
						</span>
						<GithubOAuth />
					</fieldset>
				</form>
			</div>
		</>
	);
};

export default Login;
