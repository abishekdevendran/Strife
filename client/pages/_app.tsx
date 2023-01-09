import '../styles/globals.css';
import { Toaster } from 'react-hot-toast';
import { UserProvider } from '../contexts/UserContext';
import AuthGuard from '../components/AuthGuard';
import { Poppins } from '@next/font/google';
import Layout from '../components/Layout';
// import { ThemeProvider } from '../contexts/ThemeContext';
import { ThemeProvider } from 'next-themes';

const poppins = Poppins({
	weight: ['600', '400'],
	style: ['normal', 'italic'],
	subsets: ['latin'],
	fallback: ['sans-serif'],
	variable: '--font-poppins',
	display: 'swap',
});

export default function App({
	Component,
	pageProps,
}: {
	Component: any;
	pageProps: any;
}) {
	return (
		<ThemeProvider themes={['pastel', 'forest', 'black', 'business']}>
			<div className={`${poppins.className} transition-all delay-150`}>
				<UserProvider>
					<Layout>
						{Component.requireAuth ? (
							<AuthGuard>
								<Component {...pageProps} />
							</AuthGuard>
						) : (
							<Component {...pageProps} />
						)}
					</Layout>
					<Toaster />
				</UserProvider>
			</div>
		</ThemeProvider>
	);
}
