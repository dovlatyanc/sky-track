import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useNavigate } from 'react-router'
import { trpc } from '@/lib/trpc'
import { PAGES } from '@/config/pages.config'
import { ProfileDetails } from './ProfileDetails'
import { UserManagement } from './UserManagement'
import { NewsManagement } from './NewsManagement'
import { useTranslation } from 'react-i18next'

export function Profile() {
  const { t } = useTranslation('profile')
  const { user, isLoading, logout } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'profile' | 'users' | 'news'>('profile')
  
  const { data: users, refetch: refetchUsers } = trpc.admin.getAllUsers.useQuery(undefined, {
    enabled: user?.role === 'ADMIN'
  })
  
  const { data: news, refetch: refetchNews } = trpc.news.getAllAdmin.useQuery(undefined, {
    enabled: user?.role === 'ADMIN'
  })
  
  const makeAdmin = trpc.admin.makeAdmin.useMutation({ onSuccess: () => refetchUsers() })
  const deleteUser = trpc.admin.deleteUser.useMutation({ onSuccess: () => refetchUsers() })
  const updateUser = trpc.admin.updateUser.useMutation({ onSuccess: () => refetchUsers() })
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-muted-foreground">{t('loading')}</div>
      </div>
    )
  }
  
  if (!user) {
    navigate(PAGES.LOGIN)
    return null
  }
  
  const isAdmin = user.role === 'ADMIN'
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-3 sm:p-4">
      <div className="w-full max-w-4xl bg-card rounded-xl shadow-lg border border-border overflow-hidden">
        <div className="h-24 sm:h-32 bg-gradient-to-r from-primary/20 to-primary/10" />
        
        <div className="relative px-4 sm:px-6 pb-4 sm:pb-6">
          <div className="flex flex-col items-center -mt-12 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col items-center sm:flex-row sm:items-end gap-3 sm:gap-4">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-primary/20 rounded-full flex items-center justify-center border-4 border-card">
                <span className="text-2xl sm:text-3xl font-bold text-primary">
                  {user.email?.[0]?.toUpperCase() || 'U'}
                </span>
              </div>
              
              <div className="text-center sm:text-left">
                <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
                  <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                    {user.name || user.email?.split('@')[0] || 'User'}
                  </h1>
                  {isAdmin && (
                    <span className="px-2 py-1 bg-purple-500/20 text-purple-500 rounded text-xs font-medium">
                      {t('admin')}
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground break-all">{user.email}</p>
              </div>
            </div>
            
            <button
              onClick={logout}
              className="mt-4 sm:mt-0 px-4 py-2 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 transition-colors font-medium text-sm sm:text-base w-full sm:w-auto"
            >
              {t('sign_out')}
            </button>
          </div>
        </div>
        
        {isAdmin && (
          <div className="border-b border-border px-4 sm:px-6 overflow-x-auto">
            <div className="flex gap-2 sm:gap-4 min-w-max">
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-3 sm:px-4 py-2 font-medium transition-colors border-b-2 text-sm sm:text-base whitespace-nowrap ${
                  activeTab === 'profile'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {t('profile_tab')}
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`px-3 sm:px-4 py-2 font-medium transition-colors border-b-2 text-sm sm:text-base whitespace-nowrap ${
                  activeTab === 'users'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {t('users_tab')}
              </button>
              <button
                onClick={() => setActiveTab('news')}
                className={`px-3 sm:px-4 py-2 font-medium transition-colors border-b-2 text-sm sm:text-base whitespace-nowrap ${
                  activeTab === 'news'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {t('news_tab')}
              </button>
            </div>
          </div>
        )}
        
        <div className="px-4 sm:px-6 py-4">
          {activeTab === 'profile' && <ProfileDetails user={user} />}
          {activeTab === 'users' && isAdmin && (
            <UserManagement 
              users={users || []} 
              makeAdmin={makeAdmin}
              deleteUser={deleteUser}
              updateUser={updateUser}
              currentUserId={user.id}
            />
          )}
          {activeTab === 'news' && isAdmin && (
            <NewsManagement news={news || []} onUpdate={() => refetchNews()} />
          )}
        </div>
      </div>
    </div>
  )
}