import { useAuth } from '@/hooks/useAuth'
import { useNavigate } from 'react-router'
import { PAGES } from '@/config/pages.config'

export function Profile() {
	const { user, isLoading, logout } = useAuth()
	const navigate = useNavigate()

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen bg-background">
				<div className="text-muted-foreground">Loading...</div>
			</div>
		)
	}

	if (!user) {
		navigate(PAGES.LOGIN)
		return null
	}

	return (
		<div className="flex items-center justify-center min-h-screen bg-background p-4">
			<div className="w-full max-w-2xl bg-card rounded-xl shadow-lg border border-border overflow-hidden">
				{/* Header с обложкой */}
				<div className="h-32 bg-gradient-to-r from-primary/20 to-primary/10" />
				
				{/* Аватар и информация */}
				<div className="relative px-6 pb-6">
					<div className="flex flex-col items-center -mt-12 sm:flex-row sm:items-end sm:justify-between">
						<div className="flex flex-col items-center sm:flex-row sm:items-end gap-4">
							{/* Аватар-заглушка */}
							<div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center border-4 border-card">
								<span className="text-3xl font-bold text-primary">
									{user.email?.[0]?.toUpperCase() || 'U'}
								</span>
							</div>
							
							<div className="text-center sm:text-left">
								<h1 className="text-2xl font-bold text-foreground">
									{user.name || user.email?.split('@')[0] || 'User'}
								</h1>
								<p className="text-sm text-muted-foreground">{user.email}</p>
							</div>
						</div>
						
						<button
							onClick={logout}
							className="mt-4 sm:mt-0 px-4 py-2 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 transition-colors font-medium"
						>
							Sign Out
						</button>
					</div>
				</div>

				{/* Детали профиля */}
				<div className="border-t border-border px-6 py-4">
					<h2 className="text-lg font-semibold text-foreground mb-4">Account Details</h2>
					
					<div className="space-y-3">
						<div className="flex justify-between py-2 border-b border-border/50">
							<span className="text-muted-foreground">Email</span>
							<span className="text-foreground font-mono">{user.email}</span>
						</div>
						
						{user.name && (
							<div className="flex justify-between py-2 border-b border-border/50">
								<span className="text-muted-foreground">Name</span>
								<span className="text-foreground">{user.name}</span>
							</div>
						)}
						
						<div className="flex justify-between py-2 border-b border-border/50">
							<span className="text-muted-foreground">Member since</span>
							<span className="text-foreground">
								{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'}
							</span>
						</div>
						
						<div className="flex justify-between py-2">
							<span className="text-muted-foreground">User ID</span>
							<span className="text-foreground font-mono text-sm">{user.id?.slice(0, 8)}...</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}