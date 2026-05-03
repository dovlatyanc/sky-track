import { useState } from 'react'
import { trpc } from '@/lib/trpc'

import { ShopSidebar } from '@/components/shop/ShopSidebar'
import { useAuth } from '@/hooks/useAuth'
import { format } from 'date-fns'

export function News() {
  const { user } = useAuth()
  const [selectedNews, setSelectedNews] = useState<any>(null)
  
  const { data: news, refetch } = trpc.news.getAll.useQuery()
  const isAdmin = user?.role === 'ADMIN'

  if (!news) return <div className="p-8">Loading...</div>

  return (
    <div className="min-h-screen bg-background">
      <ShopSidebar />
      
      <div className="lg:ml-64">
        <div className="p-4 pb-24 lg:p-6">
          <h1 className="text-2xl font-bold text-foreground mb-6">Aviation News</h1>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
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
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                    {item.content}
                  </p>
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span>{item.author?.name || item.author?.email}</span>
                    <span>{format(new Date(item.createdAt), 'dd.MM.yyyy')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {news?.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No news yet.</p>
          )}
        </div>
      </div>
      
      {/* Модальное окно с новостью */}
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
    // Валидация
    if (!form.title.trim()) {
      alert('Title is required')
      return
    }
    if (!form.content.trim()) {
      alert('Content is required')
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
                placeholder="Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full p-2 bg-background border border-input rounded"
              />
              <textarea
                placeholder="Content"
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                rows={8}
                className="w-full p-2 bg-background border border-input rounded"
              />
              <input
                type="url"
                placeholder="Image URL (optional)"
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
                <span className="text-sm">Published</span>
              </label>
              <div className="flex gap-2">
                <button onClick={handleSave} className="px-4 py-2 bg-primary text-primary-foreground rounded">
                  Save
                </button>
                <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-secondary rounded">
                  Cancel
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
              <p className="text-foreground whitespace-pre-wrap mb-6">{news.content}</p>
              
              {isAdmin && (
                <div className="flex gap-2 pt-4 border-t border-border">
                  <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-primary text-primary-foreground rounded">
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Delete this news?')) {
                        deleteNews.mutate({ id: news.id })
                      }
                    }}
                    className="px-4 py-2 bg-destructive text-destructive-foreground rounded"
                  >
                    Delete
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