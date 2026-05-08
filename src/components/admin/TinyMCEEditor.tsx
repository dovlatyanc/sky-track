import  { useRef, useEffect, useCallback, useMemo } from 'react'
import { Editor } from '@tinymce/tinymce-react'

interface TinyMCEEditorProps {
  initialValue: string
  onChange: (content: string) => void
}

export function TinyMCEEditor({ initialValue, onChange }: TinyMCEEditorProps) {
  const editorRef = useRef<any>(null)
  const isMountedRef = useRef(false)
  const lastContentRef = useRef(initialValue)

  // Стабилизируем onChange, чтобы избежать лишних ререндеров
  const handleEditorChange = useCallback((content: string) => {
    if (content !== lastContentRef.current) {
      lastContentRef.current = content
      onChange(content)
    }
  }, [onChange])

  // Обновляем контент только при внешнем изменении initialValue
  // и только если редактор не в фокусе (чтобы не ломать ввод пользователя)
  useEffect(() => {
    if (!isMountedRef.current || !editorRef.current) return
    
    const editor = editorRef.current
    const currentContent = editor.getContent()
    
    // Обновляем только если:
    // 1. initialValue реально изменился
    // 2. редактор не в фокусе (пользователь не печатает)
    // 3. контент действительно отличается
    if (
      initialValue !== lastContentRef.current &&
      !editor.hasFocus() &&
      currentContent !== initialValue
    ) {
      // Сохраняем позицию курсора (на случай, если всё же нужно обновить)
      const bookmark = editor.selection.getBookmark(2, true)
      editor.setContent(initialValue)
      lastContentRef.current = initialValue
      
      // Пытаемся восстановить курсор
      if (bookmark) {
        editor.selection.moveToBookmark(bookmark)
      }
    }
  }, [initialValue])

  // Инициализация при первом монтировании
  const handleInit = useCallback((_evt: any, editor: any) => {
    editorRef.current = editor
    isMountedRef.current = true
    
    // Применяем LTR стили
    const body = editor.getBody()
    if (body) {
      body.style.direction = 'ltr'
      body.style.textAlign = 'left'
    }
    
    // Устанавливаем начальное значение только один раз
    if (initialValue && editor.getContent() !== initialValue) {
      editor.setContent(initialValue)
      lastContentRef.current = initialValue
    }
  }, [initialValue])

  // Мемоизируем init-конфиг, чтобы избежать пересоздания
  const initConfig = useMemo(() => ({
    height: 400,
    menubar: false,
    language: 'ru' as const,
    directionality: 'ltr' as const,
    rtl_ui: false,
    plugins: ['lists', 'link', 'image', 'code', 'advlist'],
    toolbar: 'undo redo | bold italic underline | bullist numlist | link image | code',
    content_style: `
      body { 
        direction: ltr !important; 
        text-align: left !important; 
        font-size: 14px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }
    `,
    // Важно: отключаем автоматический фокус при инициализации
    auto_focus: false,
  }), [])

  return (
    <Editor
      apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
      onInit={handleInit}
      onEditorChange={handleEditorChange}
      init={initConfig}
     
    />
  )
}