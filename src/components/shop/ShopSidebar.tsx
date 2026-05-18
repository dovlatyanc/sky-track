import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router'
import { ShoppingCart, Ticket, Newspaper, History, Heart, User, Menu, X } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useTranslation } from 'react-i18next'

interface MenuItem {
  id: string
  label: string
  icon: React.ReactNode
  path: string
  onlyAuth?: boolean
}

export function ShopSidebar() {
  const { user } = useAuth()
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const { t } = useTranslation('common')

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024)
    }
    checkDesktop()
    window.addEventListener('resize', checkDesktop)
    return () => window.removeEventListener('resize', checkDesktop)
  }, [])

  useEffect(() => {
    setIsOpen(false)
  }, [location.pathname])

  const menuItems: MenuItem[] = [
    { id: 'shop', label: t('shop'), icon: <Ticket size={20} />, path: '/shop' },
    { id: 'news', label: t('news'), icon: <Newspaper size={20} />, path: '/shop/news' },
    { id: 'cart', label: t('cart'), icon: <ShoppingCart size={20} />, path: '/shop/cart' },
    { id: 'profile', label: t('profile'), icon: <User size={20} />, path: '/shop/profile', onlyAuth: true },
    { id: 'orders', label: t('orders'), icon: <History size={20} />, path: '/shop/orders', onlyAuth: true },
    { id: 'favorite-tickets', label: t('favorite_tickets'), icon: <Heart size={20} />, path: '/favorite-tickets', onlyAuth: true }
  ]

  const visibleItems = menuItems.filter(item => !item.onlyAuth || (item.onlyAuth && user))

  // Десктоп — сайдбар всегда виден слева
  if (isDesktop) {
    return (
      <aside className="fixed top-0 left-0 w-64 h-full bg-card border-r border-border overflow-y-auto z-40">
        <div className="p-5 border-b border-border">
          <h2 className="text-xl font-bold text-foreground">{t('menu')}</h2>
        </div>
        <nav className="p-3 space-y-1">
          {visibleItems.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors
                ${isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}
              `}
            >
              {item.icon}
              <span className="text-sm font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>
        {!user && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-card">
            <p className="text-xs text-muted-foreground mb-2 text-center">{t('sign_in_to_access')}</p>
            <NavLink to="/login" className="flex items-center justify-center gap-2 w-full px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm">
              <User size={14} /> {t('sign_in')}
            </NavLink>
          </div>
        )}
      </aside>
    )
  }

  // Мобилка — сайдбар выезжает слева
  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-20 left-4 z-50 p-2 rounded-lg bg-card border border-border shadow-md"
        aria-label={t('open_menu')}
      >
        <Menu size={22} />
      </button>

      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 left-0 bottom-0 w-72 bg-card z-40 transition-transform duration-300 ease-in-out shadow-xl
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">{t('menu')}</h3>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-lg hover:bg-muted"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="p-3 space-y-1 overflow-y-auto" style={{ height: 'calc(100% - 60px)' }}>
          {visibleItems.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-3 rounded-lg transition-colors w-full
                ${isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'}
              `}
            >
              {item.icon}
              <span className="text-sm font-medium">{item.label}</span>
            </NavLink>
          ))}

          {!user && (
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground mb-2 text-center">
                {t('sign_in_to_access')}
              </p>
              <NavLink
                to="/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium"
              >
                <User size={14} /> {t('sign_in')}
              </NavLink>
            </div>
          )}
        </nav>
      </div>
    </>
  )
}