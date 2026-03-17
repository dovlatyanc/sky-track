import { Outlet } from 'react-router'

import { Header } from './header/Header'

export function Layout() {
	return (
		<div className='xs:p-2.5 relative p-7 sm:p-3'>
			<Header />
			<Outlet />
		</div>
	)
}
