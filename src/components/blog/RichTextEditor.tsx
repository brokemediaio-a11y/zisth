import { useEffect, useRef } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import './RichTextEditor.css'

export interface RichTextEditorProps {
  value: string
  onChange: (html: string) => void
  placeholder?: string
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const uploadInputRef = useRef<HTMLInputElement>(null)

  const readImageAsDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(String(reader.result))
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsDataURL(file)
    })

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
        HTMLAttributes: {
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      }),
      Image.configure({
        allowBase64: true,
      }),
      Placeholder.configure({
        placeholder: placeholder ?? 'Write something…',
      }),
    ],
    content: value || '',
    editorProps: {
      attributes: {
        class: 'rte__content',
      },
      handlePaste: (_view, event) => {
        const e = event as ClipboardEvent
        const items = Array.from(e.clipboardData?.items ?? [])
        const imageItem = items.find((it) => it.kind === 'file' && it.type.startsWith('image/'))
        const file = imageItem?.getAsFile()
        if (!file) return false

        void readImageAsDataUrl(file).then((src) => {
          editor?.chain().focus().setImage({ src }).run()
        })
        return true
      },
      handleDrop: (_view, event) => {
        const e = event as DragEvent
        const files = Array.from(e.dataTransfer?.files ?? [])
        const imageFiles = files.filter((f) => f.type.startsWith('image/'))
        if (imageFiles.length === 0) return false

        e.preventDefault()
        void Promise.all(imageFiles.map(readImageAsDataUrl)).then((srcs) => {
          const chain = editor?.chain().focus()
          if (!chain) return
          srcs.forEach((src) => chain.setImage({ src }))
          chain.run()
        })
        return true
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  // Sync external value -> editor (used when loading an existing blog)
  useEffect(() => {
    if (!editor) return
    const current = editor.getHTML()
    const next = value || ''
    if (current !== next) {
      editor.commands.setContent(next, false)
    }
  }, [editor, value])

  const onToggleLink = () => {
    if (!editor) return
    const previousUrl = editor.getAttributes('link').href as string | undefined
    const url = window.prompt('Enter URL', previousUrl ?? 'https://')
    if (url == null) return
    if (url.trim() === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url.trim() }).run()
  }

  const onInsertImage = () => {
    if (!editor) return
    const url = window.prompt('Image URL')
    if (!url) return
    editor.chain().focus().setImage({ src: url.trim() }).run()
  }

  const onUploadImageClick = () => {
    uploadInputRef.current?.click()
  }

  const onUploadImageSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editor) return
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) return
    const src = await readImageAsDataUrl(file)
    editor.chain().focus().setImage({ src }).run()
    e.target.value = ''
  }

  if (!editor) {
    return <div className="rte rte--loading">Loading editor…</div>
  }

  return (
    <div className="rte">
      <div className="rte__toolbar" role="toolbar" aria-label="Blog editor toolbar">
        <input
          ref={uploadInputRef}
          className="rte__file-input"
          type="file"
          accept="image/*"
          onChange={onUploadImageSelected}
          aria-hidden
          tabIndex={-1}
        />
        <button
          type="button"
          className={`rte__btn ${editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}`}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        >
          H1
        </button>
        <button
          type="button"
          className={`rte__btn ${editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}`}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          H2
        </button>
        <span className="rte__divider" aria-hidden />
        <button
          type="button"
          className={`rte__btn ${editor.isActive('bold') ? 'is-active' : ''}`}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          Bold
        </button>
        <button
          type="button"
          className={`rte__btn ${editor.isActive('italic') ? 'is-active' : ''}`}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          Italic
        </button>
        <button
          type="button"
          className={`rte__btn ${editor.isActive('underline') ? 'is-active' : ''}`}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          Underline
        </button>
        <button
          type="button"
          className={`rte__btn ${editor.isActive('strike') ? 'is-active' : ''}`}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          Strike
        </button>
        <span className="rte__divider" aria-hidden />
        <button
          type="button"
          className={`rte__btn ${editor.isActive('bulletList') ? 'is-active' : ''}`}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          • List
        </button>
        <button
          type="button"
          className={`rte__btn ${editor.isActive('orderedList') ? 'is-active' : ''}`}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          1. List
        </button>
        <span className="rte__divider" aria-hidden />
        <button type="button" className={`rte__btn ${editor.isActive('link') ? 'is-active' : ''}`} onClick={onToggleLink}>
          Link
        </button>
        <button type="button" className="rte__btn" onClick={onInsertImage}>
          Image URL
        </button>
        <button type="button" className="rte__btn" onClick={onUploadImageClick}>
          Upload Image
        </button>
        <span className="rte__spacer" />
        <button
          type="button"
          className="rte__btn"
          onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
        >
          Clear
        </button>
      </div>
      <div className="rte__canvas">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

