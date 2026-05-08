import { useState, useEffect } from 'react'
import { TinyMCEEditor } from '@/components/admin/TinyMCEEditor'

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
  // Локальное состояние, не влияет на родителя
  const [title, setTitle] = useState(initialTitle)
  const [content, setContent] = useState(initialContent)
  const [isPublished, setIsPublished] = useState(initialPublished)

  // Обновляем локальное состояние при изменении пропсов (для редактирования)
  useEffect(() => {
    setTitle(initialTitle)
    setContent(initialContent)
    setIsPublished(initialPublished)
  }, [initialTitle, initialContent, initialPublished])

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
    <div className="mb-6 p-4 bg-muted rounded-lg">
      <h3 className="font-medium mb-3">
        {initialTitle ? 'Edit News' : 'Create News'}
      </h3>
      <div className="space-y-3">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 bg-background border border-input rounded"
        />
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
        <div className="flex gap-2">
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="px-3 py-1 bg-green-500 text-white rounded text-sm disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
          <button
            onClick={onCancel}
            className="px-3 py-1 bg-gray-500 text-white rounded text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}