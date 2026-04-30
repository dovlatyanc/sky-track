import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '@/hooks/useAuth'
import { PAGES } from '@/config/pages.config'

export function Login() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const { login, isLoggingIn } = useAuth()
	const navigate = useNavigate()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		try {
			await login({ email, password })
			navigate(PAGES.HOME)
		} catch (err) {
			alert('Invalid credentials')
		}
	}

	return (
		<div className="flex items-center justify-center min-h-screen bg-background">
			<div className="relative w-full max-w-md p-8 m-4 bg-card rounded-xl shadow-lg border border-border">
				{/* Декоративный элемент */}
				<div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-primary rounded-full opacity-10" />
				
				<h2 className="text-2xl font-bold mb-2 text-foreground text-center">
					Welcome back
				</h2>
				<p className="text-sm text-muted-foreground text-center mb-6">
					Sign in to your account
				</p>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-foreground mb-1">
							Email
						</label>
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-colors"
							placeholder="user@example.com"
							required
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-foreground mb-1">
							Password
						</label>
						<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-colors"
							placeholder="••••••"
							required
						/>
					</div>

					<button
						type="submit"
						disabled={isLoggingIn}
						className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{isLoggingIn ? 'Signing in...' : 'Sign In'}
					</button>

					<p className="text-center text-sm text-muted-foreground">
						Don't have an account?{' '}
						<a href={PAGES.REGISTER} className="text-primary hover:underline font-medium">
							Create account
						</a>
					</p>
				</form>
			</div>
		</div>
	)
}