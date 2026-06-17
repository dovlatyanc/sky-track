import { match } from 'path-to-regexp'
import { useLocation, Link } from 'react-router'
import { useAuth } from '@/hooks/useAuth'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'

import { ThemeToggle } from '../ThemeToggle'
import { LanguageSwitcher } from '../header/LanguageSwitcher'
import { MobileMenuItem } from './MobileMenuItem'
import { mobileMenuData } from './mobile-menu.data'
import { PAGES } from '@/config/pages.config'
import { LogOut, User, LogIn, UserPlus, ChevronUp } from 'lucide-react'
export function MobileMenu() {
	const location = useLocation()
	const { user, logout } = useAuth()
	const { t } = useTranslation()
	const [isOpen, setIsOpen] = useState(false)

	const visibleItems = mobileMenuData.filter(item => 
		!item.onlyAuth || (item.onlyAuth && user)
	)

	return (
		<>
			{/* Кнопка открытия меню (снизу слева) */}
			<button
				onClick={() => setIsOpen(true)}
				className='fixed bottom-6 left-4 z-[9999] p-3 rounded-full bg-card border border-border shadow-md hover:bg-muted transition-colors desktop:hidden'
				aria-label='Open menu'
			>
				<ChevronUp size={24} className='text-foreground' />
			</button>

			{/* Затемнение фона */}
			{isOpen && (
				<div 
					className='fixed inset-0 bg-black/50 z-[9998] desktop:hidden'
					onClick={() => setIsOpen(false)}
				/>
			)}

			<div
				className={`
					fixed left-0 bottom-0 z-[9999] w-full rounded-t-3xl p-4 px-6 shadow-xl bg-card dark:bg-[#2e2e2e]
					transition-transform duration-300 ease-in-out
					${isOpen ? 'translate-y-0' : 'translate-y-full'}
					desktop:hidden
				`}
>
				<nav>
					{/* Первая строка: основные пункты меню + LanguageSwitcher + ThemeToggle */}
					<ul className='flex flex-wrap items-center justify-center gap-4 sm:gap-5 pb-2'>
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
						
						{/* Language Switcher */}
						<li key="language-switcher" className='inline-flex items-center justify-center'>
							<LanguageSwitcher />
						</li>
					</ul>

					{/* Вторая строка: авторизация / регистрация / профиль / выход */}
					<div className="border-t border-border pt-2 mt-1">
						<ul className='flex items-center justify-center gap-4 sm:gap-5'>
							{!user ? (
								<>
									<li key="login">
										<Link
											to={PAGES.LOGIN}
											className='flex items-center gap-1 text-foreground transition-colors hover:text-primary'
										>
											<LogIn size={18} strokeWidth={1.5} />
											<span className='text-xs'>{t('sign_in')}</span>
										</Link>
									</li>
									<li key="register">
										<Link
											to={PAGES.REGISTER}
											className='flex items-center gap-1 text-foreground transition-colors hover:text-primary'
										>
											<UserPlus size={18} strokeWidth={1.5} />
											<span className='text-xs'>{t('sign_up')}</span>
										</Link>
									</li>
								</>
							) : (
								<>
									<li key="profile">
										<Link
											to={PAGES.PROFILE}
											className='flex items-center gap-1 text-foreground transition-colors hover:text-primary'
										>
											<User size={18} strokeWidth={1.5} />
											<span className='text-xs max-w-[100px] truncate'>
												{user.email?.split('@')[0] || t('profile')}
											</span>
										</Link>
									</li>
									<li key="logout">
										<button
											onClick={logout}
											className='flex items-center gap-1 text-destructive transition-colors hover:text-destructive/80'
											aria-label={t('sign_out')}
										>
											<LogOut size={18} strokeWidth={1.5} />
											<span className='text-xs'>{t('sign_out')}</span>
										</button>
									</li>
								</>
							)}
						</ul>
					</div>
				</nav>
			</div>
		</>
	)
}