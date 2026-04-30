import { PAGES } from '@/config/pages.config'

export interface IHeaderMenuItem {
	label: string
	href: string
}

export const headerMenuData = [
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
		label: 'Tickets shop', 
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