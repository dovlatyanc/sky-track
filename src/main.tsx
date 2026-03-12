import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'

import { Layout } from './components/Layout'
import './index.css'
import { ThemeProvider } from './providers/theme/ThemeProvider'
import { Home } from './screens/home/Home'

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<ThemeProvider>
			<BrowserRouter>
				<Routes>
					<Route element={<Layout />}>
						<Route
							path="/"
							element={<Home />}
						/>
					</Route>
				</Routes>
			</BrowserRouter>
		</ThemeProvider>
	</StrictMode>
)
