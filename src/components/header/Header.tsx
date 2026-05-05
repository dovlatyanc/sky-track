import { match } from 'path-to-regexp'
import { Link, useLocation } from 'react-router'
import { useAuth } from '@/hooks/useAuth'

import { ThemeToggle } from '../ThemeToggle'
import { Heart } from '../animate-ui/icons/heart'
import { User } from '../animate-ui/icons/user'
import { Button } from '../ui/button'

import { HeaderMenuItem } from './HeaderMenuItem'
import { headerMenuData } from './header-menu.data'
import { PAGES } from '@/config/pages.config'

export function Header() {
	const location = useLocation()
	const { user, logout } = useAuth()

	return (
		<div className='xs:hidden bg-card sm:px-mini-element xs:flex-col xs:pb-4 fixed top-0 lg:top-7 left-1/2 z-50 flex w-full lg:w-4/12 -translate-x-1/2 items-center justify-between rounded-b-xl lg:rounded-xl p-2 px-5 sm:rounded-lg xl:relative xl:top-0 xl:mb-5 xl:w-full shadow-md'>
			<div className='xs:flex-wrap xs:justify-center xs:mb-3 flex items-center gap-4 sm:gap-2 2xl:gap-3'>
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
				{/* Auth кнопки */}
				{user ? (
					<>
						<span className='text-sm text-muted-foreground hidden sm:inline'>
							{user.email}
						</span>
						
						<Button 
							onClick={logout} 
							variant='destructive' 
							size='sm'
							className='text-sm'
						>
							Logout
						</Button>

						<Button asChild variant='ghost' size='icon'>
							<Link to={PAGES.PROFILE}>
								<User animateOnHover size={26} />  
							</Link>
						</Button>
					</>
				) : (
					<>
						<Button asChild variant='default' size='sm'>
							<Link to={PAGES.LOGIN}>Login</Link>
						</Button>
						<Button asChild variant='outline' size='sm'>
							<Link to={PAGES.REGISTER}>Register</Link>
						</Button>
					</>
				)}
				
				{user && (
					<Button asChild variant='secondary' size='icon'>
						<Link to={PAGES.FAVORITES}>
							<Heart animateOnHover size={22} />
						</Link>
					</Button>
				)}
				
				<ThemeToggle />
			</div>
		</div>
	)
}