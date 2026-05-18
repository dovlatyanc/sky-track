import { match } from 'path-to-regexp'
import { useLocation } from 'react-router'
import { useAuth } from '@/hooks/useAuth'

import { ThemeToggle } from '../ThemeToggle'
import { MobileMenuItem } from './MobileMenuItem'
import { mobileMenuData } from './mobile-menu.data'

export function MobileMenu() {
	const location = useLocation()
	const { user } = useAuth()

	const visibleItems = mobileMenuData.filter(item => 
		!item.onlyAuth || (item.onlyAuth && user)
	)

	return (
		<div className='xs:block fixed right-0 bottom-3 left-0 z-10 mx-auto hidden w-fit rounded-3xl p-2 px-4 shadow-xl bg-card dark:bg-[#2e2e2e]'>
			<nav>
				<ul className='flex items-center justify-center gap-4 sm:gap-5'>
					{visibleItems.map((item) =>
						item.label === 'Toggle Theme' ? (
							<li
								key={item.href}
								className='inline-flex items-center justify-center'
							>
								<ThemeToggle isMobile />
							</li>
						) : (
							<MobileMenuItem
								key={item.href}
								item={item}
								isActive={!!match(item.href)(location.pathname)}
							/>
						)
					)}
				</ul>
			</nav>
		</div>
	)
}