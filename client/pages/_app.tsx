import '../styles/globals.css';
import { Toaster } from 'react-hot-toast';
import { UserProvider } from '../contexts/UserContext';
import { Poppins } from '@next/font/google';
import Layout from '../components/Layout';
// import { ThemeProvider } from '../contexts/ThemeContext';
import { ThemeProvider } from 'next-themes';
import CustomToast from '../components/CustomToast';
import { AnimatePresence } from 'framer-motion';
import { AppProps } from 'next/app';

const poppins = Poppins({
	weight: ['900', '800', '600'],
	style: ['normal', 'italic'],
	subsets: ['latin'],
	fallback: ['sans-serif'],
	variable: '--font-poppins',
	display: 'swap',
});

export default function App({ Component, pageProps }: AppProps) {
	return (
		<ThemeProvider themes={['pastel', 'dark', 'valentine', 'night']}>
			<div
				className={`${poppins.className} transition-all delay-150 ease-in-out h-screen w-full`}
			>
				<UserProvider>
					<Layout>
						<Component {...pageProps} />
					</Layout>
				</UserProvider>
				<Toaster>{(t) => <CustomToast t={t} />}</Toaster>
			</div>
		</ThemeProvider>
	);
}
