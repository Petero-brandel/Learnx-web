'use client'

import React, { useCallback, useRef, useState } from 'react'
import { useEditor, EditorContent, ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import Image from '@tiptap/extension-image'
import Youtube from '@tiptap/extension-youtube'
import { 
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, 
  Heading1, Heading2, Heading3, List, ListOrdered, 
  Quote, Code, AlignLeft, AlignCenter, AlignRight, AlignJustify, 
  Link as LinkIcon, Image as ImageIcon, Video as YoutubeIcon, 
  Undo, Redo, Palette, Loader2, Maximize, Minimize
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { uploadImageAction } from '@/app/actions/upload'

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
}

const ResizableMediaNode = ({ node, updateAttributes, selected, getPos, editor }: any) => {
  const isVideo = node.type.name === 'youtube'
  const [isResizing, setIsResizing] = useState(false)
  
  return (
    <NodeViewWrapper 
      className="relative inline-block" 
      style={{ width: node.attrs.width || (isVideo ? 640 : '100%'), maxWidth: '100%' }}
    >
      <div 
        className={cn("relative", isResizing && "pointer-events-none")}
        onClick={() => {
          if (typeof getPos === 'function') {
            editor.commands.setNodeSelection(getPos())
          }
        }}
      >
        {isVideo ? (
          <>
            <iframe
              src={node.attrs.src}
              className={cn("rounded-lg w-full aspect-video border-2 transition-colors", selected ? "border-blue-500" : "border-transparent")}
              allowFullScreen
            />
            <div className={cn("absolute inset-0 z-10", selected ? "pointer-events-none" : "cursor-pointer")} />
          </>
        ) : (
          <img
            src={node.attrs.src}
            alt={node.attrs.alt}
            className={cn("rounded-lg border-2 transition-colors w-full h-auto", selected ? "border-blue-500" : "border-transparent")}
          />
        )}
      </div>
      
      {(selected || isResizing) && (
        <div 
          className="absolute -bottom-2 -right-2 w-8 h-8 cursor-se-resize flex items-center justify-center z-50"
          onMouseDown={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setIsResizing(true)
            const startX = e.clientX
            const startWidth = (e.currentTarget.parentElement as HTMLElement)?.offsetWidth || 0
            
            const onMouseMove = (e: MouseEvent) => {
              e.preventDefault()
              const newWidth = Math.max(150, startWidth + (e.clientX - startX))
              updateAttributes({ width: newWidth })
            }
            const onMouseUp = () => {
              setIsResizing(false)
              document.removeEventListener('mousemove', onMouseMove)
              document.removeEventListener('mouseup', onMouseUp)
            }
            document.addEventListener('mousemove', onMouseMove)
            document.addEventListener('mouseup', onMouseUp)
          }}
        >
          <div className="w-4 h-4 bg-blue-500 rounded-sm shadow-sm border border-white dark:border-zinc-950" />
        </div>
      )}
    </NodeViewWrapper>
  )
}

const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: '100%',
        parseHTML: element => element.getAttribute('width'),
        renderHTML: attributes => {
          return {
            width: attributes.width,
          }
        }
      }
    }
  },
  addNodeView() {
    return ReactNodeViewRenderer(ResizableMediaNode)
  }
})

const CustomYoutube = Youtube.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: 640,
        parseHTML: element => element.getAttribute('width'),
        renderHTML: attributes => {
          return {
            width: attributes.width,
          }
        }
      }
    }
  },
  addNodeView() {
    return ReactNodeViewRenderer(ResizableMediaNode)
  }
})

const MenuBar = ({ editor, isExpanded, onToggleExpand }: { editor: any, isExpanded: boolean, onToggleExpand: () => void }) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadingImage, setUploadingImage] = useState(false)

  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)

    if (url === null) {
      return
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const { url, error } = await uploadImageAction(formData)
      
      if (error) {
        alert(error)
        return
      }
      
      if (url) {
        editor.chain().focus().setImage({ src: url }).run()
      }
    } catch (err) {
      console.error(err)
      alert('Failed to upload image')
    } finally {
      setUploadingImage(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const addYoutubeVideo = useCallback(() => {
    const url = prompt('Enter YouTube URL')

    if (url) {
      editor.commands.setYoutubeVideo({
        src: url,
        width: Math.max(320, parseInt(editor.view.dom.clientWidth, 10)) - 60,
        height: Math.max(180, parseInt(editor.view.dom.clientWidth, 10) * 0.5) - 60,
      })
    }
  }, [editor])

  if (!editor) {
    return null
  }

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-zinc-200 dark:border-zinc-800 p-2 bg-zinc-50/50 dark:bg-zinc-900/50 rounded-t-xl">
      {/* Formatting */}
      <button
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleBold().run() }}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={cn("p-1.5 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold hover:text-black dark:hover:text-white transition-colors", editor.isActive('bold') && "bg-zinc-200 dark:bg-zinc-800 text-blue-600 dark:text-blue-400")}
        title="Bold"
      >
        <Bold className="h-4 w-4" />
      </button>
      <button
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleItalic().run() }}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={cn("p-1.5 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold hover:text-black dark:hover:text-white transition-colors", editor.isActive('italic') && "bg-zinc-200 dark:bg-zinc-800 text-blue-600 dark:text-blue-400")}
        title="Italic"
      >
        <Italic className="h-4 w-4" />
      </button>
      <button
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleUnderline().run() }}
        className={cn("p-1.5 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold hover:text-black dark:hover:text-white transition-colors", editor.isActive('underline') && "bg-zinc-200 dark:bg-zinc-800 text-blue-600 dark:text-blue-400")}
        title="Underline"
      >
        <UnderlineIcon className="h-4 w-4" />
      </button>
      <button
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleStrike().run() }}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={cn("p-1.5 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold hover:text-black dark:hover:text-white transition-colors", editor.isActive('strike') && "bg-zinc-200 dark:bg-zinc-800 text-blue-600 dark:text-blue-400")}
        title="Strikethrough"
      >
        <Strikethrough className="h-4 w-4" />
      </button>
      
      <div className="w-px h-5 bg-zinc-300 dark:bg-zinc-700 mx-1" />

      {/* Headings */}
      <button
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 1 }).run() }}
        className={cn("p-1.5 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold hover:text-black dark:hover:text-white transition-colors", editor.isActive('heading', { level: 1 }) && "bg-zinc-200 dark:bg-zinc-800 text-blue-600 dark:text-blue-400")}
        title="Heading 1"
      >
        <Heading1 className="h-4 w-4" />
      </button>
      <button
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 2 }).run() }}
        className={cn("p-1.5 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold hover:text-black dark:hover:text-white transition-colors", editor.isActive('heading', { level: 2 }) && "bg-zinc-200 dark:bg-zinc-800 text-blue-600 dark:text-blue-400")}
        title="Heading 2"
      >
        <Heading2 className="h-4 w-4" />
      </button>
      <button
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 3 }).run() }}
        className={cn("p-1.5 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold hover:text-black dark:hover:text-white transition-colors", editor.isActive('heading', { level: 3 }) && "bg-zinc-200 dark:bg-zinc-800 text-blue-600 dark:text-blue-400")}
        title="Heading 3"
      >
        <Heading3 className="h-4 w-4" />
      </button>

      <div className="w-px h-5 bg-zinc-300 dark:bg-zinc-700 mx-1" />

      {/* Lists & Blocks */}
      <button
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleBulletList().run() }}
        className={cn("p-1.5 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold hover:text-black dark:hover:text-white transition-colors", editor.isActive('bulletList') && "bg-zinc-200 dark:bg-zinc-800 text-blue-600 dark:text-blue-400")}
        title="Bullet List"
      >
        <List className="h-4 w-4" />
      </button>
      <button
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleOrderedList().run() }}
        className={cn("p-1.5 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold hover:text-black dark:hover:text-white transition-colors", editor.isActive('orderedList') && "bg-zinc-200 dark:bg-zinc-800 text-blue-600 dark:text-blue-400")}
        title="Ordered List"
      >
        <ListOrdered className="h-4 w-4" />
      </button>
      <button
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleBlockquote().run() }}
        className={cn("p-1.5 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold hover:text-black dark:hover:text-white transition-colors", editor.isActive('blockquote') && "bg-zinc-200 dark:bg-zinc-800 text-blue-600 dark:text-blue-400")}
        title="Blockquote"
      >
        <Quote className="h-4 w-4" />
      </button>
      <button
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleCodeBlock().run() }}
        className={cn("p-1.5 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold hover:text-black dark:hover:text-white transition-colors", editor.isActive('codeBlock') && "bg-zinc-200 dark:bg-zinc-800 text-blue-600 dark:text-blue-400")}
        title="Code Block"
      >
        <Code className="h-4 w-4" />
      </button>

      <div className="w-px h-5 bg-zinc-300 dark:bg-zinc-700 mx-1" />

      {/* Alignment */}
      <button
        onClick={(e) => { e.preventDefault(); editor.chain().focus().setTextAlign('left').run() }}
        className={cn("p-1.5 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold hover:text-black dark:hover:text-white transition-colors", editor.isActive({ textAlign: 'left' }) && "bg-zinc-200 dark:bg-zinc-800 text-blue-600 dark:text-blue-400")}
        title="Align Left"
      >
        <AlignLeft className="h-4 w-4" />
      </button>
      <button
        onClick={(e) => { e.preventDefault(); editor.chain().focus().setTextAlign('center').run() }}
        className={cn("p-1.5 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold hover:text-black dark:hover:text-white transition-colors", editor.isActive({ textAlign: 'center' }) && "bg-zinc-200 dark:bg-zinc-800 text-blue-600 dark:text-blue-400")}
        title="Align Center"
      >
        <AlignCenter className="h-4 w-4" />
      </button>
      <button
        onClick={(e) => { e.preventDefault(); editor.chain().focus().setTextAlign('right').run() }}
        className={cn("p-1.5 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold hover:text-black dark:hover:text-white transition-colors", editor.isActive({ textAlign: 'right' }) && "bg-zinc-200 dark:bg-zinc-800 text-blue-600 dark:text-blue-400")}
        title="Align Right"
      >
        <AlignRight className="h-4 w-4" />
      </button>

      <div className="w-px h-5 bg-zinc-300 dark:bg-zinc-700 mx-1" />

      {/* Media & Links */}
      <button
        onClick={(e) => { e.preventDefault(); setLink() }}
        className={cn("p-1.5 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold hover:text-black dark:hover:text-white transition-colors", editor.isActive('link') && "bg-zinc-200 dark:bg-zinc-800 text-blue-600 dark:text-blue-400")}
        title="Link"
      >
        <LinkIcon className="h-4 w-4" />
      </button>
      <button
        onClick={(e) => { e.preventDefault(); fileInputRef.current?.click() }}
        disabled={uploadingImage}
        className={cn("p-1.5 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold hover:text-black dark:hover:text-white transition-colors disabled:opacity-50", editor.isActive('image') && "bg-zinc-200 dark:bg-zinc-800 text-blue-600 dark:text-blue-400")}
        title="Upload Image"
      >
        {uploadingImage ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
      </button>
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleImageUpload} 
        accept="image/*" 
        className="hidden" 
      />
      <button
        onClick={(e) => { e.preventDefault(); addYoutubeVideo() }}
        className="p-1.5 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold hover:text-black dark:hover:text-white transition-colors"
        title="YouTube Video"
      >
        <YoutubeIcon className="h-4 w-4" />
      </button>

      <div className="w-px h-5 bg-zinc-300 dark:bg-zinc-700 mx-1" />
      
      {/* Color */}
      <div className="flex items-center gap-1.5 p-1 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors relative cursor-pointer" title="Text Color">
        <Palette className="h-4 w-4 text-zinc-800 dark:text-zinc-200 font-bold hover:text-black dark:hover:text-white" />
        <input
          type="color"
          onChange={event => {
            editor.chain().focus().setColor((event.target as HTMLInputElement).value).run()
          }}
          value={editor.getAttributes('textStyle').color || '#000000'}
          className="h-5 w-5 p-0 border-0 rounded overflow-hidden cursor-pointer bg-transparent"
        />
      </div>

      <div className="flex-1" />

      {/* Undo/Redo */}
      <button
        onClick={(e) => { e.preventDefault(); editor.chain().focus().undo().run() }}
        disabled={!editor.can().chain().focus().undo().run()}
        className="p-1.5 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold hover:text-black dark:hover:text-white transition-colors disabled:opacity-50"
        title="Undo"
      >
        <Undo className="h-4 w-4" />
      </button>
      <button
        onClick={(e) => { e.preventDefault(); editor.chain().focus().redo().run() }}
        disabled={!editor.can().chain().focus().redo().run()}
        className="p-1.5 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold hover:text-black dark:hover:text-white transition-colors disabled:opacity-50"
        title="Redo"
      >
        <Redo className="h-4 w-4" />
      </button>

      <div className="w-px h-5 bg-zinc-300 dark:bg-zinc-700 mx-1" />

      {/* Expand/Collapse */}
      <button
        onClick={(e) => { e.preventDefault(); onToggleExpand() }}
        className="p-1.5 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold hover:text-black dark:hover:text-white transition-colors"
        title={isExpanded ? "Minimize" : "Maximize"}
      >
        {isExpanded ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
      </button>
    </div>
  )
}

export const RichTextEditor = ({ content, onChange }: RichTextEditorProps) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-500 underline',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      CustomImage,
      CustomYoutube,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert prose-sm sm:prose-base focus:outline-none max-w-none p-4 min-h-[200px] text-zinc-900 dark:text-zinc-100',
      },
    },
  })

  const editorContent = (
    <div className={cn(
      "border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-950 flex flex-col shadow-sm dark:shadow-none transition-all duration-200 relative",
      isExpanded ? "w-full max-w-5xl mx-auto flex-1 shadow-2xl" : ""
    )}>
      <MenuBar editor={editor} isExpanded={isExpanded} onToggleExpand={() => setIsExpanded(!isExpanded)} />
      <div className={cn("flex-1 overflow-y-auto", isExpanded ? "h-[calc(80vh-60px)]" : "max-h-[500px]")}>
        <EditorContent editor={editor} />
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #adb5bd;
          pointer-events: none;
          height: 0;
        }
        .ProseMirror blockquote {
          border-left: 3px solid #e4e4e7;
          padding-left: 1rem;
          color: #71717a;
          margin-left: 0;
          margin-right: 0;
        }
        .dark .ProseMirror blockquote {
          border-left-color: #3f3f46;
          color: #a1a1aa;
        }
        .ProseMirror pre {
          background: #f4f4f5;
          color: #18181b;
          font-family: monospace;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
        }
        .dark .ProseMirror pre {
          background: #18181b;
          color: #e4e4e7;
        }
        .ProseMirror code {
          background: #f4f4f5;
          color: #ef4444;
          padding: 0.2em 0.4em;
          border-radius: 0.25rem;
          font-size: 0.875em;
        }
        .dark .ProseMirror code {
          background: #27272a;
          color: #f87171;
        }
        .ProseMirror pre code {
          background: transparent;
          color: inherit;
          padding: 0;
        }
        .ProseMirror ul {
          list-style-type: disc;
          padding-left: 1.5rem;
        }
        .ProseMirror ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
        }
        .ProseMirror img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
        }
        .ProseMirror iframe {
          width: 100%;
          border-radius: 0.5rem;
        }
        .ProseMirror h1 { font-size: 1.875rem; font-weight: 700; line-height: 1.2; margin-top: 2rem; margin-bottom: 1rem; }
        .ProseMirror h2 { font-size: 1.5rem; font-weight: 600; line-height: 1.3; margin-top: 1.5rem; margin-bottom: 0.75rem; }
        .ProseMirror h3 { font-size: 1.25rem; font-weight: 600; line-height: 1.4; margin-top: 1.25rem; margin-bottom: 0.5rem; }
        .ProseMirror p { margin-top: 0.75rem; margin-bottom: 0.75rem; }
      `}} />
    </div>
  )

  if (isExpanded) {
    return (
      <>
        {/* Placeholder to keep layout from shifting */}
        <div className="w-full min-h-[200px] border border-dashed border-zinc-300 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900/30 flex items-center justify-center text-zinc-500 text-sm">
          Editor is open in expanded view...
        </div>
        
        {/* Modal Overlay */}
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-12 bg-zinc-900/40 dark:bg-black/60 backdrop-blur-sm">
          {editorContent}
        </div>
      </>
    )
  }

  return editorContent
}

export default RichTextEditor
