import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
	return (
		<>
			<Head>
				<title>Strife Home</title>
				<meta name="description" content="Strife Homepage" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
			</Head>
			<main>
				<h1>Strife App Homepage</h1>
				<Link href="/login">Login</Link>
				<Link href="/register">Register</Link>
			</main>
		</>
	);
}
