import Head from 'next/head';
import Link from 'next/link';
import GithubOAuth from '../components/GithubOAuth';
export default function Home() {
	return (
		<>
			<Head>
				<title>Strife Home</title>
				<meta name="description" content="Strife Homepage" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
			</Head>
			<div className="card bg-base-300 sm:p-16 sm:py-20 p-8 py-12">
				<h1 className="font-black text-8xl lg:text-9xl tracking-tight">Strife</h1>
				<span className="grid grid-cols-2 gap-x-2 mt-12">
					<Link
						href="/login"
						className="btn btn-primary disabled:btn-disabled btn-sm md:btn-md lg:btn-lg"
					>
						Login
					</Link>
					<Link
						href="/register"
						className="btn btn-accent disabled:btn-disabled btn-sm md:btn-md lg:btn-lg"
					>
						Register
					</Link>
				</span>
				<GithubOAuth />
			</div>
		</>
	);
}
