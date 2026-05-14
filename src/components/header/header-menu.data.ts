import { PAGES } from '@/config/pages.config'

export interface IHeaderMenuItem {
  label: string
  href: string
}

// Функция-геттер для получения переведённых меток
export const getHeaderMenuData = (t: (key: string) => string): IHeaderMenuItem[] => [
  {
    label: t('home'),
    href: PAGES.HOME
  },
  {
    label: t('about_page'),
    href: PAGES.ABOUT
  },
  {
    label: t('contacts'),
    href: PAGES.CONTACTS
  },
  {
    label: t('shop'),
    href: PAGES.SHOP
  }
]

// Функция-геттер для auth меню
export const getAuthMenuData = (t: (key: string) => string) => ({
  login: {
    label: t('sign_in'),
    href: PAGES.LOGIN
  },
  register: {
    label: t('sign_up'),
    href: PAGES.REGISTER
  },
  logout: {
    label: t('sign_out'),
    href: '#'
  }
})

// Для обратной совместимости
export const headerMenuData: IHeaderMenuItem[] = [
  {
    label: 'Home',
    href: PAGES.HOME
  },
  {
    label: 'About',
    href: PAGES.ABOUT
  },
  {
    label: 'Contacts',
    href: PAGES.CONTACTS
  },
  {
    label: 'Services',
    href: PAGES.SHOP
  }
]

export const authMenuData = {
  login: {
    label: 'Login',
    href: PAGES.LOGIN
  },
  register: {
    label: 'Register',
    href: PAGES.REGISTER
  },
  logout: {
    label: 'Logout',
    href: '#'
  }
}