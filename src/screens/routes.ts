import { AboutUs } from './about-us/AboutUs'
import { Contacts } from './contacts/Contacts'
import { Favorites } from './favorites/Favorites'
import { Home } from './home/Home'
import { Shop } from './shop/Shop'
import { Login } from './auth/Login'     
import { Register } from './auth/Register'
import { Profile } from './profile/Profile'

import { PAGES } from '@/config/pages.config'

export const ROUTES = [
	{
		component: Home,
		path: PAGES.HOME
	},
	{
		component: AboutUs,
		path: PAGES.ABOUT
	},
	{
		component: Contacts,
		path: PAGES.CONTACTS
	},
	{
		component: Favorites,
		path: PAGES.FAVORITES
	},
	{
		component: Shop,
		path: PAGES.SHOP 
	},
	{
		component: Login,      
		path: PAGES.LOGIN
	},
	{
		component: Register,  
		path: PAGES.REGISTER
	},
	{
		component: Profile,  
		path: PAGES.PROFILE
	}
	
]
	

