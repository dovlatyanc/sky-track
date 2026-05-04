import { trpc } from '@/lib/trpc'

export function useAuth() {
	const utils = trpc.useUtils()
	
	const register = trpc.auth.register.useMutation({
		onSuccess: async (data) => {  
			localStorage.setItem('token', data.token)
			
			await utils.auth.me.refetch()
		}
	})
	
	const mergeCart = trpc.cart.mergeCarts.useMutation()

	const login = trpc.auth.login.useMutation({
	onSuccess: async (data) => {
		localStorage.setItem('token', data.token)
		const guestId = localStorage.getItem('guestId')
		if (guestId) {
		await mergeCart.mutateAsync({ guestId })
		localStorage.removeItem('guestId')
		}
		utils.auth.me.invalidate()
	}
	})
	
	const logout = () => {
		localStorage.removeItem('token')
		utils.auth.me.reset()
	}
	
	const { data: user, isLoading } = trpc.auth.me.useQuery(undefined, {
		enabled: !!localStorage.getItem('token')
	})
	
	return {
		user, 
		isLoading,
		register: register.mutate,
		login: login.mutate,
		logout,
		isRegistering: register.isPending,
		isLoggingIn: login.isPending,
		error: register.error || login.error
	}
}