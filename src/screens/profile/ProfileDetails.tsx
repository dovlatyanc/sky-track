import { useTranslation } from 'react-i18next'

export function ProfileDetails({ user }: { user: any }) {
  const { t } = useTranslation('profile')
  
  return (
    <>
      <h2 className="text-base sm:text-lg font-semibold text-foreground mb-4">{t('account_details')}</h2>
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-border/50 gap-1 sm:gap-0">
          <span className="text-muted-foreground text-sm sm:text-base">{t('email_label')}</span>
          <span className="text-foreground font-mono text-xs sm:text-sm break-all">{user.email}</span>
        </div>
        
        {user.name && (
          <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-border/50 gap-1 sm:gap-0">
            <span className="text-muted-foreground text-sm sm:text-base">{t('name_label')}</span>
            <span className="text-foreground text-sm sm:text-base">{user.name}</span>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-border/50 gap-1 sm:gap-0">
          <span className="text-muted-foreground text-sm sm:text-base">{t('role_label')}</span>
          <span className={`font-medium text-sm sm:text-base ${user.role === 'ADMIN' ? 'text-purple-500' : 'text-blue-500'}`}>
            {user.role === 'ADMIN' ? t('admin') : t('user')}
          </span>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-border/50 gap-1 sm:gap-0">
          <span className="text-muted-foreground text-sm sm:text-base">{t('member_since')}</span>
          <span className="text-foreground text-sm sm:text-base">
            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'}
          </span>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:justify-between py-2 gap-1 sm:gap-0">
          <span className="text-muted-foreground text-sm sm:text-base">{t('user_id')}</span>
          <span className="text-foreground font-mono text-xs sm:text-sm">{user.id?.slice(0, 8)}...</span>
        </div>
      </div>
    </>
  )
}