import { useState } from 'react'
import { trpc } from '@/lib/trpc'
import { NewsForm } from '@/components/news/NewsForm'
import { useTranslation } from 'react-i18next'

export function NewsManagement({ news, onUpdate }: { news: any[], onUpdate: () => void }) {
  const { t } = useTranslation('profile')
  const [mode, setMode] = useState<'list' | 'create' | 'edit'>('list')
  const [editingNews, setEditingNews] = useState<any>(null)
  
  const utils = trpc.useUtils()
  
  const createNews = trpc.news.create.useMutation({
    onSuccess: () => {
      utils.news.getAllAdmin.invalidate()
      onUpdate()
      setMode('list')
    },
    onError: (error) => alert(`Error: ${error.message}`)
  })
  
  const updateNews = trpc.news.update.useMutation({
    onSuccess: () => {
      utils.news.getAllAdmin.invalidate()
      onUpdate()
      setMode('list')
      setEditingNews(null)
    },
    onError: (error) => alert(`Error: ${error.message}`)
  })
  
  const deleteNews = trpc.news.delete.useMutation({
    onSuccess: () => {
      utils.news.getAllAdmin.invalidate()
      onUpdate()
    },
    onError: (error) => alert(`Error: ${error.message}`)
  })
  
  const handleSave = (data: { title: string; content: string; isPublished: boolean }) => {
    if (mode === 'create') {
      createNews.mutate(data)
    } else if (mode === 'edit' && editingNews) {
      updateNews.mutate({ id: editingNews.id, ...data })
    }
  }
  
  const handleEdit = (newsItem: any) => {
    setEditingNews(newsItem)
    setMode('edit')
  }
  
  const handleCancel = () => {
    setMode('list')
    setEditingNews(null)
  }
  
  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
        <h2 className="text-base sm:text-lg font-semibold text-foreground">{t('news_management')}</h2>
        {mode === 'list' && (
          <button
            onClick={() => setMode('create')}
            className="w-full sm:w-auto px-4 py-2 bg-primary text-primary-foreground rounded text-sm"
          >
            + {t('add_news')}
          </button>
        )}
      </div>
      
      {mode === 'create' && (
        <NewsForm
          onSave={handleSave}
          onCancel={handleCancel}
          isSaving={createNews.isPending}
        />
      )}
      
      {mode === 'edit' && editingNews && (
        <NewsForm
          initialTitle={editingNews.title}
          initialContent={editingNews.content}
          initialPublished={editingNews.isPublished}
          onSave={handleSave}
          onCancel={handleCancel}
          isSaving={updateNews.isPending}
        />
      )}
      
      {mode === 'list' && (
        <div className="space-y-3">
          {news?.map((item) => (
            <div key={item.id} className="p-3 sm:p-4 bg-muted rounded-lg">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                <div className="flex-1 w-full">
                  <h3 className="font-semibold text-foreground text-sm sm:text-base">{item.title}</h3>
                  <div 
                    className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mt-1"
                    dangerouslySetInnerHTML={{ __html: item.content }}
                  />
                  <div className="flex flex-wrap gap-2 sm:gap-4 mt-2 text-xs text-muted-foreground">
                    <span>{t('status')}: {item.isPublished ? '✅ ' + t('published') : '📝 ' + t('draft')}</span>
                    <span>{t('views')}: {item.views || 0}</span>
                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => handleEdit(item)}
                    className="flex-1 sm:flex-none px-3 py-1.5 bg-blue-500 text-white rounded text-xs"
                  >
                    {t('edit')}
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(t('delete_confirm_news'))) {
                        deleteNews.mutate({ id: item.id })
                      }
                    }}
                    className="flex-1 sm:flex-none px-3 py-1.5 bg-red-500 text-white rounded text-xs"
                  >
                    {t('delete')}
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {news?.length === 0 && (
            <p className="text-center text-muted-foreground py-8">{t('no_news')}</p>
          )}
        </div>
      )}
    </div>
  )
}