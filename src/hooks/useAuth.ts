import { trpc } from '@/lib/trpc'

export function useAuth() {
	const utils = trpc.useUtils()
	
	const register = trpc.auth.register.useMutation({
		onSuccess: (data) => {
			localStorage.setItem('token', data.token)
			utils.auth.me.invalidate()
		}
	})
	
	const login = trpc.auth.login.useMutation({
		onSuccess: (data) => {
			localStorage.setItem('token', data.token)
			utils.auth.me.invalidate()
		}
	})
	
	const logout = () => {
		localStorage.removeItem('token')
		utils.auth.me.invalidate()
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