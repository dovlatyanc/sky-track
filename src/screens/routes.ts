import { AboutUs } from './about-us/AboutUs'
import { Contacts } from './contacts/Contacts'
import { Favorites } from './favorites/Favorites'
import { Home } from './home/Home'
import { Shop } from './shop/Shop'
import { Login } from './auth/Login'     
import { Register } from './auth/Register'
import { Profile } from './profile/Profile'
import { News } from './shop/News'
import { Orders } from './shop/Orders'
import { Cart } from './shop/Cart'
import { ShopProfile } from './shop/ShopProfile'
import { SuccessPage } from './shop/SuccessPage' 
import { NotFound } from './NotFound' 
import { FavoriteTickets } from './shop/FavoriteTickets'

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
	},
	{
	component: ShopProfile,
	path: PAGES.SHOP_PROFILE
	},
	{
		component: News,
		path: PAGES.NEWS
		},
		{
		component: Cart,
		path: PAGES.CART
		},
		{
		component: Orders,
		path: PAGES.ORDERS
		},
		{
		component: FavoriteTickets,
		path: PAGES.FAVORITE_TICKETS
		},
		{
		component: SuccessPage,    
		path: PAGES.SUCCESS
		},
		{
		component: NotFound,       // (должна быть последней)
		path: PAGES.NOT_FOUND
		}
	
]
	

