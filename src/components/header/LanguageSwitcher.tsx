import { useTranslation } from 'react-i18next'
import { Globe } from 'lucide-react'

export function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const currentLanguage = i18n.language

  const toggleLanguage = () => {
    const newLang = currentLanguage === 'ru' ? 'en' : 'ru'
    i18n.changeLanguage(newLang)
    localStorage.setItem('i18nextLng', newLang)
  }

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-muted transition-colors"
      aria-label="Switch language"
    >
      <Globe size={18} />
      <span className="text-sm font-medium uppercase">{currentLanguage}</span>
    </button>
  )
}