import { createContext, useEffect, useReducer } from 'react';
import { themeChange } from 'theme-change';

type ThemeContextType = {
	theme: string;
	toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextType>({
	theme: 'pastel',
	toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const themes = ['pastel', 'forest', 'black', 'business'];
	const [theme, toggleTheme] = useReducer((theme) => {
		const index = themes.indexOf(theme);
		const body=document.querySelector('body');
    if(body){
      body.setAttribute('data-theme', themes[(index + 1) % themes.length]);
    }
		return themes[(index + 1) % themes.length];
	}, 'pastel');

	useEffect(() => {
		themeChange(false);
	}, []);

	return (
		<ThemeContext.Provider value={{ theme, toggleTheme }}>
			{children}
		</ThemeContext.Provider>
	);
}

export default ThemeContext;
