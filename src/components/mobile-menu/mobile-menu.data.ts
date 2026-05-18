import type { ComponentType } from 'react'
import { 
  Home,
  ShoppingBag,
  User,
  Heart,
  Moon,
  MessageCircleHeart
} from 'lucide-react'

import { PAGES } from '@/config/pages.config'

export interface IMobileMenuItem {
  icon: ComponentType<{ size?: number; strokeWidth?: number; className?: string }>
  label: string
  href: string
  onlyAuth?: boolean
}

export const mobileMenuData: IMobileMenuItem[] = [
  {
    label: 'Home',
    href: PAGES.HOME,
    icon: Home,
  },
  {
    label: 'Shop',
    href: PAGES.SHOP,
    icon: ShoppingBag,
  },
  {
    label: 'Profile',
    href: PAGES.PROFILE,
    icon: User,
    onlyAuth: true,
  },
  {
    label: 'Favorites',
    href: PAGES.FAVORITES,
    icon: Heart,
  },
  {
    label: 'Toggle Theme',
    href: '#',
    icon: Moon,
  },
  {
    label: 'Contacts',
    href: PAGES.CONTACTS,
    icon: MessageCircleHeart,
  },
]