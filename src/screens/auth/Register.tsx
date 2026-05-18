import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '@/hooks/useAuth'
import { PAGES } from '@/config/pages.config'
import { TurnstileCaptcha } from './TurnstileCaptcha'

export function Register() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [name, setName] = useState('')
	const [captchaToken, setCaptchaToken] = useState<string | null>(null)
	const { register, isRegistering } = useAuth()
	const navigate = useNavigate()

	// Автозаполнение email, если сохранён в localStorage
	useEffect(() => {
		const savedEmail = localStorage.getItem('savedEmail')
		if (savedEmail) {
			setEmail(savedEmail)
		}
	}, [])

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		
		// Проверка CAPTCHA
		if (!captchaToken) {
			alert('Please confirm you are not a robot')
			return
		}
		
		try {
			await register({ email, password, name: name || undefined, captchaToken })
			navigate(PAGES.HOME)
		} catch (err) {
			alert('Registration failed')
			setCaptchaToken(null)
		}
	}

	return (
		<div className="flex items-center justify-center min-h-screen bg-background">
			<div className="relative w-full max-w-md p-8 m-4 bg-card rounded-xl shadow-lg border border-border">
				{/* Декоративный элемент */}
				<div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-primary rounded-full opacity-10" />
				
				<h2 className="text-2xl font-bold mb-2 text-foreground text-center">
					Create account
				</h2>
				<p className="text-sm text-muted-foreground text-center mb-6">
					Join SkyTracker today
				</p>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-foreground mb-1">
							Name <span className="text-muted-foreground">(optional)</span>
						</label>
						<input
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
							className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-colors"
							placeholder="Your name"
						/>
					</div>

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
							placeholder="•••••• (min 6 characters)"
							required
						/>
					</div>

					{/* CAPTCHA */}
					<div className="flex justify-center my-4">
						<TurnstileCaptcha 
							onVerify={setCaptchaToken}
							onError={() => setCaptchaToken(null)}
							onExpire={() => setCaptchaToken(null)}
						/>
					</div>

					<button
						type="submit"
						disabled={isRegistering}
						className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{isRegistering ? 'Creating account...' : 'Create Account'}
					</button>

					<p className="text-center text-sm text-muted-foreground">
						Already have an account?{' '}
						<a href={PAGES.LOGIN} className="text-primary hover:underline font-medium">
							Sign in
						</a>
					</p>
				</form>
			</div>
		</div>
	)
}