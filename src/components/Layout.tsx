import { Outlet } from 'react-router'
import { Header } from './header/Header'

export function Layout() {
	return (
		<div className="relative p-7 sm:p-2.5">
			<Header />
			<Outlet />
		</div>
	)
}
