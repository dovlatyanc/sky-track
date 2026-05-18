import { useState, useEffect } from 'react'
import { trpc } from '@/lib/trpc'
import { ShopSidebar } from '@/components/shop/ShopSidebar'
import { useAuth } from '@/hooks/useAuth'
import { format } from 'date-fns'
import { Menu } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function News() {
  const { t } = useTranslation('news')
  const { user } = useAuth()
  const [selectedNews, setSelectedNews] = useState<any>(null)
  
  const { data: news, refetch } = trpc.news.getAll.useQuery()
  const isAdmin = user?.role === 'ADMIN'

  useEffect(() => {
    const handleResize = () => {}
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (!news) return (
    <div className="flex justify-center items-center h-screen bg-background">
      <div className="text-base text-muted-foreground">{t('loading')}</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      <ShopSidebar />
      
      <div className="pt-16 lg:pt-4 px-3 pb-24 lg:px-6 lg:pb-6">
        <button
          className="lg:hidden fixed top-4 left-4 z-40 p-2 bg-card border border-border rounded-lg"
        >
          <Menu size={20} />
        </button>

        <div className="mb-6">
          <h1 className="text-xl font-bold text-foreground mb-4 lg:text-2xl lg:mb-5">
            {t('title')}
          </h1>
        </div>
        
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {news?.map((item) => (
            <div
              key={item.id}
              className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedNews(item)}
            >
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                  {item.title}
                </h3>
                <div 
                  className="text-sm text-muted-foreground line-clamp-3 mb-3"
                  dangerouslySetInnerHTML={{ __html: item.content.replace(/<[^>]*>/g, '').slice(0, 150) + '...' }}
                />
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>{item.author?.name || item.author?.email}</span>
                  <span>{format(new Date(item.createdAt), 'dd.MM.yyyy')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {news?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{t('no_news')}</p>
          </div>
        )}
      </div>
      
      {selectedNews && (
        <NewsModal 
          news={selectedNews} 
          onClose={() => setSelectedNews(null)} 
          isAdmin={isAdmin} 
          onUpdate={refetch} 
        />
      )}
    </div>
  )
}

function NewsModal({ news, onClose, isAdmin, onUpdate }: any) {
  const { t } = useTranslation('news')
  const [isEditing, setIsEditing] = useState(false)
  const [form, setForm] = useState({
    title: news.title || '',
    content: news.content || '',
    imageUrl: news.imageUrl || '',
    isPublished: news.isPublished ?? true
  })
  
  const createNews = trpc.news.create.useMutation({
    onSuccess: () => {
      onUpdate()
      onClose()
    }
  })
  
  const updateNews = trpc.news.update.useMutation({
    onSuccess: () => {
      onUpdate()
      onClose()
    }
  })
  
  const deleteNews = trpc.news.delete.useMutation({
    onSuccess: () => {
      onUpdate()
      onClose()
    }
  })
  
  const handleSave = () => {
    if (!form.title.trim()) {
      alert(t('title_required'))
      return
    }
    if (!form.content.trim()) {
      alert(t('content_required'))
      return
    }
    
    if (news.id) {
      updateNews.mutate({ id: news.id, ...form })
    } else {
      createNews.mutate(form as any)
    }
  }
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-card rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          {isEditing && isAdmin ? (
            <div className="space-y-4">
              <input
                type="text"
                placeholder={t('title_label')}
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full p-2 bg-background border border-input rounded"
              />
              <textarea
                placeholder={t('content_label')}
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                rows={8}
                className="w-full p-2 bg-background border border-input rounded font-mono text-sm"
              />
              <input
                type="url"
                placeholder={t('image_url')}
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                className="w-full p-2 bg-background border border-input rounded"
              />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.isPublished}
                  onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                />
                <span className="text-sm">{t('published')}</span>
              </label>
              <div className="flex gap-2">
                <button onClick={handleSave} className="px-4 py-2 bg-primary text-primary-foreground rounded">
                  {t('save')}
                </button>
                <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-secondary rounded">
                  {t('cancel')}
                </button>
              </div>
            </div>
          ) : (
            <>
              {news.imageUrl && (
                <img src={news.imageUrl} alt={news.title} className="w-full h-64 object-cover rounded-lg mb-4" />
              )}
              <h2 className="text-2xl font-bold text-foreground mb-2">{news.title}</h2>
              <div className="flex justify-between text-sm text-muted-foreground mb-4">
                <span>{news.author?.name || news.author?.email}</span>
                <span>{format(new Date(news.createdAt), 'dd.MM.yyyy HH:mm')}</span>
              </div>
              <div 
                className="prose prose-sm dark:prose-invert max-w-none mb-6"
                dangerouslySetInnerHTML={{ __html: news.content }}
              />
              {isAdmin && (
                <div className="flex gap-2 pt-4 border-t border-border">
                  <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-primary text-primary-foreground rounded">
                    {t('edit')}
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(t('delete_confirm'))) {
                        deleteNews.mutate({ id: news.id })
                      }
                    }}
                    className="px-4 py-2 bg-destructive text-destructive-foreground rounded"
                  >
                    {t('delete')}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}