import { Outlet } from 'react-router'

export function CenterLayout() {
	return (
		<div className='mt-24'>
			<Outlet />
		</div>
	)
}
