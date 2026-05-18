import { Link } from 'react-router'
import { Home, ShoppingBag, ArrowLeft, Plane } from 'lucide-react'
import { ShopSidebar } from '@/components/shop/ShopSidebar'
import { useTranslation } from 'react-i18next'

export function NotFound() {
  const { t } = useTranslation('notFound')

  return (
    <div className="min-h-screen bg-background">
      <ShopSidebar />
      
      <div className="pt-16 lg:pt-4 px-3 pb-24 lg:px-6 lg:pb-6">
        <div className="flex flex-col items-center justify-center min-h-[70vh] max-w-md mx-auto text-center">
          <div className="relative mb-8">
            <div className="text-8xl sm:text-9xl font-bold text-muted-foreground/20">404</div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Plane className="text-primary w-12 h-12 sm:w-16 sm:h-16 animate-pulse" />
            </div>
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
            {t('title')}
          </h1>
          
          <p className="text-muted-foreground mb-8">
            {t('message')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <Link
              to="/"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              <Home size={18} />
              {t('go_home')}
            </Link>
            <Link
              to="/shop"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors"
            >
              <ShoppingBag size={18} />
              {t('browse_shop')}
            </Link>
            <button
              onClick={() => window.history.back()}
              className="flex items-center justify-center gap-2 px-6 py-3 border border-border rounded-lg font-medium hover:bg-muted transition-colors"
            >
              <ArrowLeft size={18} />
              {t('go_back')}
            </button>
          </div>
          
          <div className="mt-8 text-sm text-muted-foreground">
            <p>{t('helpful_links')}</p>
            <div className="flex gap-4 justify-center mt-2">
              <Link to="/shop" className="hover:text-foreground transition-colors">{t('shop')}</Link>
              <Link to="/shop/news" className="hover:text-foreground transition-colors">{t('news')}</Link>
              <Link to="/profile" className="hover:text-foreground transition-colors">{t('profile')}</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}