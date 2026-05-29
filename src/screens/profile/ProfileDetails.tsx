import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { trpc } from '@/lib/trpc'
import { useTranslation } from 'react-i18next'
import { User, Phone, IdCard, Calendar } from 'lucide-react'

export function ProfileDetails({ user }: { user: any }) {
  const { t } = useTranslation('profile')
  const { refetch } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    fullName: user.fullName || '',
    phone: user.phone || '',
    passportNumber: user.passportNumber || '',
    name: user.name || ''
  })
  const [isSaving, setIsSaving] = useState(false)

  // Форматирование номера телефона в российский формат
  const formatPhoneNumber = (value: string): string => {
    const cleaned = value.replace(/\D/g, '')
    const limited = cleaned.slice(0, 11)
    
    if (limited.length === 0) return ''
    
    let formatted = ''
    if (limited.length >= 1) {
      formatted = '+7'
    }
    if (limited.length >= 2) {
      formatted += ` (${limited.slice(1, 4)}`
    }
    if (limited.length >= 5) {
      formatted += `) ${limited.slice(4, 7)}`
    }
    if (limited.length >= 8) {
      formatted += `-${limited.slice(7, 9)}`
    }
    if (limited.length >= 10) {
      formatted += `-${limited.slice(9, 11)}`
    }
    
    return formatted
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setFormData({ ...formData, phone: formatted })
  }

  const updateProfile = trpc.auth.updateProfile.useMutation({
    onSuccess: () => {
      refetch()
      setIsEditing(false)
      setIsSaving(false)
    },
    onError: (error) => {
      console.error('Update error:', error)
      alert(`Error: ${error.message}`)
      setIsSaving(false)
    }
  })

  const handleSave = async () => {
    setIsSaving(true)
    await updateProfile.mutateAsync(formData)
  }

  const formatPhoneDisplay = (phone: string) => {
    if (!phone) return ''
    const cleaned = phone.replace(/\D/g, '')
    if (cleaned.length === 11) {
      return `+7 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7, 9)}-${cleaned.slice(9, 11)}`
    }
    return phone
  }

  // Валидация номера телефона
  const validatePhone = (phone: string): boolean => {
    const cleaned = phone.replace(/\D/g, '')
    return cleaned.length === 0 || cleaned.length === 11
  }

  const isPhoneValid = validatePhone(formData.phone)

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-base sm:text-lg font-semibold text-foreground">
          {t('account_details')}
        </h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-3 py-1 text-sm bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
          >
            {t('edit_profile')}
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1 flex items-center gap-2">
              <User size={16} /> {t('full_name_label')}
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full px-3 py-2 bg-background border border-input rounded-lg"
              placeholder={t('full_name_placeholder')}
            />
            <p className="text-xs text-muted-foreground mt-1">{t('full_name_hint')}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1 flex items-center gap-2">
              <Phone size={16} /> {t('phone_label')}
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={handlePhoneChange}
              className={`w-full px-3 py-2 bg-background border rounded-lg ${
                formData.phone && !isPhoneValid ? 'border-red-500' : 'border-input'
              }`}
              placeholder="+7 (XXX) XXX-XX-XX"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {t('phone_hint')}
              {formData.phone && !isPhoneValid && (
                <span className="text-red-500 block mt-1">Неверный формат телефона</span>
              )}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1 flex items-center gap-2">
              <IdCard size={16} /> {t('passport_label')}
            </label>
            <input
              type="text"
              value={formData.passportNumber}
              onChange={(e) => setFormData({ ...formData, passportNumber: e.target.value.toUpperCase() })}
              className="w-full px-3 py-2 bg-background border border-input rounded-lg"
              placeholder={t('passport_placeholder')}
            />
            <p className="text-xs text-muted-foreground mt-1">{t('passport_hint')}</p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={isSaving || (formData.phone && !isPhoneValid)}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50"
            >
              {isSaving ? t('saving') : t('save')}
            </button>
            <button
              onClick={() => {
                setIsEditing(false)
                setFormData({
                  fullName: user.fullName || '',
                  phone: user.phone || '',
                  passportNumber: user.passportNumber || '',
                  name: user.name || ''
                })
              }}
              className="flex-1 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80"
            >
              {t('cancel')}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-border/50 gap-1 sm:gap-0">
            <span className="text-muted-foreground text-sm sm:text-base">{t('email_label')}</span>
            <span className="text-foreground font-mono text-xs sm:text-sm break-all">{user.email}</span>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-border/50 gap-1 sm:gap-0">
            <span className="text-muted-foreground text-sm sm:text-base flex items-center gap-1">
              <User size={14} /> {t('full_name_label')}
            </span>
            <span className="text-foreground text-sm sm:text-base">
              {user.fullName || t('not_specified')}
            </span>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-border/50 gap-1 sm:gap-0">
            <span className="text-muted-foreground text-sm sm:text-base flex items-center gap-1">
              <Phone size={14} /> {t('phone_label')}
            </span>
            <span className="text-foreground text-sm sm:text-base">
              {formatPhoneDisplay(user.phone) || t('not_specified')}
            </span>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-border/50 gap-1 sm:gap-0">
            <span className="text-muted-foreground text-sm sm:text-base flex items-center gap-1">
              <IdCard size={14} /> {t('passport_label')}
            </span>
            <span className="text-foreground text-sm sm:text-base">
              {user.passportNumber || t('not_specified')}
            </span>
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
            <span className="text-muted-foreground text-sm sm:text-base flex items-center gap-1">
              <Calendar size={14} /> {t('member_since')}
            </span>
            <span className="text-foreground text-sm sm:text-base">
              {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : t('not_specified')}
            </span>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:justify-between py-2 gap-1 sm:gap-0">
            <span className="text-muted-foreground text-sm sm:text-base">{t('user_id')}</span>
            <span className="text-foreground font-mono text-xs sm:text-sm">{user.id?.slice(0, 8)}...</span>
          </div>
        </div>
      )}
    </>
  )
}