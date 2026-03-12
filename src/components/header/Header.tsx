import { match } from 'path-to-regexp'
import { Link, useLocation } from 'react-router'

import { ThemeToggle } from '../ThemeToggle'
import { Heart } from '../animate-ui/icons/heart'
import { Button } from '../ui/button'

import { HeaderMenuItem } from './HeaderMenuItem'
import { headerMenuData } from './header-menu.data'

export function Header() {
	const location = useLocation()

	return (
		<div className='bg-card sm:px-mini-element absolute top-7 left-1/2 flex w-4/12 -translate-x-1/2 items-center justify-between rounded-xl p-2 px-5 sm:rounded-lg lg:relative lg:top-0 lg:mb-5 lg:w-full'>
			<div className='flex items-center gap-4 sm:gap-2'>
				<img
					src='/logo.svg'
					alt='Sky Track Logo'
					className='mt-1 h-12 w-12 sm:h-10 sm:w-10'
				/>
				<nav>
					<ul className='flex items-center gap-5 sm:gap-3'>
						{headerMenuData.map(item => (
							<HeaderMenuItem
								key={item.href}
								item={item}
								isActive={!!match(item.href)(location.pathname)}
							/>
						))}
					</ul>
				</nav>
			</div>
			<div className='flex items-center gap-3 sm:gap-2'>
				{/* TODO: Config */}
				<Button asChild variant='secondary' size='icon'>
					<Link
						to='/favorites'
						// className='bg-card flex items-center justify-center rounded-full p-2 transition-colors hover:bg-neutral-700 sm:p-1'
					>
						<Heart size={23} />
					</Link>
				</Button>
				<ThemeToggle />
			</div>
		</div>
	)
}
