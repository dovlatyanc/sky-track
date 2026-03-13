import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter, Route, Routes } from 'react-router'

import { CenterLayout } from './components/CenterLayout'
import { Layout } from './components/Layout'
import { ThemeProvider } from './providers/theme/ThemeProvider'
import { Favorites } from './screens/favorites/Favorites'
import { Home } from './screens/home/Home'
import { store } from './store'

import './index.css'

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<ThemeProvider>
			<Provider store={store}>
				<BrowserRouter>
					<Routes>
						<Route element={<Layout />}>
							{/* TODO: Pages config */}
							{/* TODO: Pages Array  */}
							<Route path='/' element={<Home />} />
							<Route element={<CenterLayout />}>
								<Route path='/favorites' element={<Favorites />} />
							</Route>
						</Route>
					</Routes>
				</BrowserRouter>
			</Provider>
		</ThemeProvider>
	</StrictMode>
)
