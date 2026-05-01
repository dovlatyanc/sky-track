import { NavLink } from 'react-router' 
import { ShoppingCart, Ticket, Newspaper, History, Heart, User } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

interface MenuItem {
  id: string
  label: string
  icon: React.ReactNode
  path: string
  onlyAuth?: boolean
}

export function ShopSidebar() {
  const { user } = useAuth()
  
  const menuItems: MenuItem[] = [
    {
      id: 'shop',
      label: 'Tickets Shop',
      icon: <Ticket size={20} />,
      path: '/shop'
    },
    {
      id: 'news',
      label: 'News',
      icon: <Newspaper size={20} />,
      path: '/shop/news'
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: <User size={20} />,
      path: '/profile',
      onlyAuth: true
    },
    {
      id: 'cart',
      label: 'Cart',
      icon: <ShoppingCart size={20} />,
      path: '/shop/cart',
      onlyAuth: true
    },
    {
      id: 'orders',
      label: 'My Orders',
      icon: <History size={20} />,
      path: '/shop/orders',
      onlyAuth: true
    },
    {
      id: 'favorite-tickets',
      label: 'Favorite Tickets',
      icon: <Heart size={20} />,
      path: '/favorite-tickets',
      onlyAuth: true
    }
  ]
  
  const visibleItems = menuItems.filter(item => 
    !item.onlyAuth || (item.onlyAuth && user)
  )
  
  return (
    <div className="w-64 bg-card rounded-xl border border-border p-4">
      <h3 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">
        Menu
      </h3>
      <nav className="space-y-1">
        {visibleItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2 rounded-lg transition-colors w-full
              ${isActive 
                ? 'bg-primary/10 text-primary' 
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }
            `}
          >
            {item.icon}
            <span className="text-sm">{item.label}</span>
          </NavLink>
        ))}
      </nav>
      
      {/* Блок для неавторизованных */}
      {!user && (
        <div className="mt-6 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground mb-2">
            Sign in to access profile, cart and orders
          </p>
          <NavLink
            to="/login"
            className="flex items-center justify-center gap-2 w-full px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:opacity-90 transition-opacity"
          >
            <User size={16} />
            Sign In
          </NavLink>
        </div>
      )}
    </div>
  )
}