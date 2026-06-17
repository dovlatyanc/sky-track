import { useState } from 'react'
import { TinyMCEEditor } from '@/components/admin/TinyMCEEditor'
import { Sparkles } from 'lucide-react'
import { trpc } from '@/lib/trpc'

interface NewsFormProps {
  initialTitle?: string
  initialContent?: string
  initialPublished?: boolean
  onSave: (data: { title: string; content: string; isPublished: boolean }) => void
  onCancel: () => void
  isSaving: boolean
}

export function NewsForm({ 
  initialTitle = '', 
  initialContent = '', 
  initialPublished = true,
  onSave, 
  onCancel, 
  isSaving 
}: NewsFormProps) {
  const [title, setTitle] = useState(initialTitle)
  const [content, setContent] = useState(initialContent)
  const [isPublished, setIsPublished] = useState(initialPublished)
  const [isGenerating, setIsGenerating] = useState(false)
  const [aiTopic, setAiTopic] = useState('')

  const generateAI = trpc.news.generateAI.useMutation({
    onSuccess: (data) => {
      setTitle(data.title)
      setContent(data.content)
      setIsGenerating(false)
      setAiTopic('')
    },
    onError: (error) => {
      alert(`Ошибка генерации: ${error.message}`)
      setIsGenerating(false)
    }
  })

  const handleGenerateAI = () => {
    setIsGenerating(true)
    if (!aiTopic.trim()) {
      generateAI.mutate({})
    } else {
      generateAI.mutate({ topic: aiTopic })
    }
  }

  const handleSubmit = () => {
    if (!title.trim()) {
      alert('Title is required')
      return
    }
    if (!content.trim()) {
      alert('Content is required')
      return
    }
    onSave({ title, content, isPublished })
  }

  return (
    <div className="mb-6 p-3 sm:p-4 bg-muted rounded-lg">
      <h3 className="font-medium mb-3 text-sm sm:text-base">
        {initialTitle ? 'Edit News' : 'Create News'}
      </h3>
      <div className="space-y-3">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 bg-background border border-input rounded text-sm"
        />
        
        {/* AI генерация */}
        <div className="border border-border rounded-lg p-3 bg-background">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={16} className="text-primary" />
            <span className="text-sm font-medium">Сгенерировать новость через AI</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="Тема (необязательно)"
              value={aiTopic}
              onChange={(e) => setAiTopic(e.target.value)}
              className="flex-1 p-2 bg-muted border border-input rounded text-sm w-full"
            />
            <button
              type="button"
              onClick={handleGenerateAI}
              disabled={isGenerating}
              className="px-3 py-2 bg-primary/10 text-primary rounded text-sm hover:bg-primary/20 transition-colors disabled:opacity-50 w-full sm:w-auto"
            >
              {isGenerating ? 'Генерация...' : 'Сгенерировать'}
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            AI сгенерирует заголовок и текст. Можно указать тему или оставить пустым.
          </p>
        </div>
        
        <TinyMCEEditor
          initialValue={content}
          onChange={setContent}
        />
        
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
          />
          <span className="text-sm">Published</span>
        </label>
        
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="w-full sm:w-auto px-4 py-2 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
          <button
            onClick={onCancel}
            className="w-full sm:w-auto px-4 py-2 bg-gray-500 text-white rounded text-sm hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}