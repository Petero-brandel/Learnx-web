'use client'

import React, { useCallback, useRef, useState } from 'react'
import {
  useEditor,
  EditorContent,
  ReactNodeViewRenderer,
  NodeViewWrapper,
} from '@tiptap/react'

import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import Image from '@tiptap/extension-image'
import Youtube from '@tiptap/extension-youtube'

import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  Image as ImageIcon,
  Video as YoutubeIcon,
  Undo,
  Redo,
  Palette,
  Loader2,
  Maximize,
  Minimize,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { uploadImageAction } from '@/app/actions/upload'

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
}

const ResizableMediaNode = ({
  node,
  updateAttributes,
  selected,
  getPos,
  editor,
}: any) => {
  const isVideo = node.type.name === 'youtube'

  const [isResizing, setIsResizing] = useState(false)

  return (
    <NodeViewWrapper
      className="relative inline-block max-w-full"
      style={{
        width: node.attrs.width || (isVideo ? 640 : '100%'),
        maxWidth: '100%',
      }}
    >
      {/* Media */}
      <div
        className={cn(
          'relative',
          isResizing && 'pointer-events-none'
        )}
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
              className={cn(
                'rounded-lg w-full aspect-video border-2 transition-colors',
                selected
                  ? 'border-blue-500'
                  : 'border-transparent'
              )}
              allowFullScreen
            />

            <div
              className={cn(
                'absolute inset-0 z-10',
                selected
                  ? 'pointer-events-none'
                  : 'cursor-pointer'
              )}
            />
          </>
        ) : (
          <img
            src={node.attrs.src}
            alt={node.attrs.alt}
            className={cn(
              'rounded-lg border-2 transition-colors w-full h-auto',
              selected
                ? 'border-blue-500'
                : 'border-transparent'
            )}
          />
        )}
      </div>

      {/* Resize Handle */}
      {(selected || isResizing) && (
        <div
          className="
            absolute
            -bottom-2
            -right-2
            w-8
            h-8
            z-50
            flex
            items-center
            justify-center
            cursor-se-resize
            touch-none
          "
          onPointerDown={(e) => {
            e.preventDefault()
            e.stopPropagation()

            setIsResizing(true)

            const startX = e.clientX

            const container =
              e.currentTarget.parentElement as HTMLElement

            const startWidth =
              container?.offsetWidth || 0

            const maxWidth =
              container.parentElement?.clientWidth ||
              window.innerWidth

            const onPointerMove = (
              event: PointerEvent
            ) => {
              const delta =
                event.clientX - startX

              const newWidth = Math.min(
                maxWidth,
                Math.max(150, startWidth + delta)
              )

              updateAttributes({
                width: newWidth,
              })
            }

            const onPointerUp = () => {
              setIsResizing(false)

              document.removeEventListener(
                'pointermove',
                onPointerMove
              )

              document.removeEventListener(
                'pointerup',
                onPointerUp
              )
            }

            document.addEventListener(
              'pointermove',
              onPointerMove
            )

            document.addEventListener(
              'pointerup',
              onPointerUp
            )
          }}
        >
          <div
            className="
              w-5
              h-5
              rounded-sm
              bg-blue-500
              border
              border-white
              dark:border-zinc-950
              shadow-md
            "
          />
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

        parseHTML: (element) =>
          element.getAttribute('width'),

        renderHTML: (attributes) => ({
          width: attributes.width,
        }),
      },
    }
  },

  addNodeView() {
    return ReactNodeViewRenderer(
      ResizableMediaNode
    )
  },
})

const CustomYoutube = Youtube.extend({
  addAttributes() {
    return {
      ...this.parent?.(),

      width: {
        default: 640,

        parseHTML: (element) =>
          element.getAttribute('width'),

        renderHTML: (attributes) => ({
          width: attributes.width,
        }),
      },
    }
  },

  addNodeView() {
    return ReactNodeViewRenderer(
      ResizableMediaNode
    )
  },
})

const ToolbarButton = ({
  active,
  onClick,
  children,
  title,
  disabled,
}: any) => (
  <button
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={cn(
      'p-1.5 rounded-md transition-colors text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 disabled:opacity-50',
      active &&
        'bg-zinc-200 dark:bg-zinc-800 text-blue-600 dark:text-blue-400'
    )}
  >
    {children}
  </button>
)

const MenuBar = ({
  editor,
  isExpanded,
  onToggleExpand,
}: {
  editor: any
  isExpanded: boolean
  onToggleExpand: () => void
}) => {
  const fileInputRef =
    useRef<HTMLInputElement>(null)

  const [uploadingImage, setUploadingImage] =
    useState(false)

  const setLink = useCallback(() => {
    const previousUrl =
      editor.getAttributes('link').href

    const url = window.prompt(
      'URL',
      previousUrl
    )

    if (url === null) return

    if (url === '') {
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .unsetLink()
        .run()

      return
    }

    editor
      .chain()
      .focus()
      .extendMarkRange('link')
      .setLink({ href: url })
      .run()
  }, [editor])

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0]

    if (!file) return

    setUploadingImage(true)

    try {
      const formData = new FormData()

      formData.append('file', file)

      const { url, error } =
        await uploadImageAction(formData)

      if (error) {
        alert(error)
        return
      }

      if (url) {
        editor
          .chain()
          .focus()
          .setImage({ src: url })
          .run()
      }
    } catch (error) {
      console.error(error)
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
        width: 640,
        height: 360,
      })
    }
  }, [editor])

  if (!editor) return null

  return (
    <div className="flex flex-wrap items-center gap-1">
      <ToolbarButton
        active={editor.isActive('bold')}
        onClick={(e: any) => {
          e.preventDefault()
          editor.chain().focus().toggleBold().run()
        }}
        title="Bold"
      >
        <Bold className="h-5 w-5" />
      </ToolbarButton>

      <ToolbarButton
        active={editor.isActive('italic')}
        onClick={(e: any) => {
          e.preventDefault()
          editor.chain().focus().toggleItalic().run()
        }}
        title="Italic"
      >
        <Italic className="h-5 w-5" />
      </ToolbarButton>

      <ToolbarButton
        active={editor.isActive('underline')}
        onClick={(e: any) => {
          e.preventDefault()
          editor
            .chain()
            .focus()
            .toggleUnderline()
            .run()
        }}
        title="Underline"
      >
        <UnderlineIcon className="h-5 w-5" />
      </ToolbarButton>

      <ToolbarButton
        active={editor.isActive('strike')}
        onClick={(e: any) => {
          e.preventDefault()
          editor.chain().focus().toggleStrike().run()
        }}
        title="Strike"
      >
        <Strikethrough className="h-5 w-5" />
      </ToolbarButton>

      <div className="w-px h-5 bg-zinc-300 dark:bg-zinc-700 mx-1" />

      <ToolbarButton
        active={editor.isActive('heading', {
          level: 1,
        })}
        onClick={(e: any) => {
          e.preventDefault()

          editor
            .chain()
            .focus()
            .toggleHeading({ level: 1 })
            .run()
        }}
        title="Heading 1"
      >
        <Heading1 className="h-5 w-5" />
      </ToolbarButton>

      <ToolbarButton
        active={editor.isActive('heading', {
          level: 2,
        })}
        onClick={(e: any) => {
          e.preventDefault()

          editor
            .chain()
            .focus()
            .toggleHeading({ level: 2 })
            .run()
        }}
        title="Heading 2"
      >
        <Heading2 className="h-5 w-5" />
      </ToolbarButton>

      <ToolbarButton
        active={editor.isActive('heading', {
          level: 3,
        })}
        onClick={(e: any) => {
          e.preventDefault()

          editor
            .chain()
            .focus()
            .toggleHeading({ level: 3 })
            .run()
        }}
        title="Heading 3"
      >
        <Heading3 className="h-5 w-5" />
      </ToolbarButton>

      <div className="w-px h-5 bg-zinc-300 dark:bg-zinc-700 mx-1" />

      <ToolbarButton
        active={editor.isActive('bulletList')}
        onClick={(e: any) => {
          e.preventDefault()

          editor
            .chain()
            .focus()
            .toggleBulletList()
            .run()
        }}
        title="Bullet List"
      >
        <List className="h-5 w-5" />
      </ToolbarButton>

      <ToolbarButton
        active={editor.isActive('orderedList')}
        onClick={(e: any) => {
          e.preventDefault()

          editor
            .chain()
            .focus()
            .toggleOrderedList()
            .run()
        }}
        title="Ordered List"
      >
        <ListOrdered className="h-5 w-5" />
      </ToolbarButton>

      <ToolbarButton
        active={editor.isActive('blockquote')}
        onClick={(e: any) => {
          e.preventDefault()

          editor
            .chain()
            .focus()
            .toggleBlockquote()
            .run()
        }}
        title="Blockquote"
      >
        <Quote className="h-5 w-5" />
      </ToolbarButton>

      <ToolbarButton
        active={editor.isActive('codeBlock')}
        onClick={(e: any) => {
          e.preventDefault()

          editor
            .chain()
            .focus()
            .toggleCodeBlock()
            .run()
        }}
        title="Code Block"
      >
        <Code className="h-5 w-5" />
      </ToolbarButton>

      <div className="w-px h-5 bg-zinc-300 dark:bg-zinc-700 mx-1" />

      <ToolbarButton
        active={editor.isActive({
          textAlign: 'left',
        })}
        onClick={(e: any) => {
          e.preventDefault()

          editor
            .chain()
            .focus()
            .setTextAlign('left')
            .run()
        }}
        title="Align Left"
      >
        <AlignLeft className="h-5 w-5" />
      </ToolbarButton>

      <ToolbarButton
        active={editor.isActive({
          textAlign: 'center',
        })}
        onClick={(e: any) => {
          e.preventDefault()

          editor
            .chain()
            .focus()
            .setTextAlign('center')
            .run()
        }}
        title="Align Center"
      >
        <AlignCenter className="h-5 w-5" />
      </ToolbarButton>

      <ToolbarButton
        active={editor.isActive({
          textAlign: 'right',
        })}
        onClick={(e: any) => {
          e.preventDefault()

          editor
            .chain()
            .focus()
            .setTextAlign('right')
            .run()
        }}
        title="Align Right"
      >
        <AlignRight className="h-5 w-5" />
      </ToolbarButton>

      <div className="w-px h-5 bg-zinc-300 dark:bg-zinc-700 mx-1" />

      <ToolbarButton
        active={editor.isActive('link')}
        onClick={(e: any) => {
          e.preventDefault()
          setLink()
        }}
        title="Link"
      >
        <LinkIcon className="h-5 w-5" />
      </ToolbarButton>

      <ToolbarButton
        onClick={(e: any) => {
          e.preventDefault()
          fileInputRef.current?.click()
        }}
        title="Upload Image"
      >
        {uploadingImage ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <ImageIcon className="h-5 w-5" />
        )}
      </ToolbarButton>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      />

      <ToolbarButton
        onClick={(e: any) => {
          e.preventDefault()
          addYoutubeVideo()
        }}
        title="YouTube"
      >
        <YoutubeIcon className="h-5 w-5" />
      </ToolbarButton>

      <div className="w-px h-5 bg-zinc-300 dark:bg-zinc-700 mx-1" />

      <div className="flex items-center gap-2 px-2">
        <Palette className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />

        <input
          type="color"
          value={
            editor.getAttributes('textStyle')
              .color || '#000000'
          }
          onChange={(e) => {
            editor
              .chain()
              .focus()
              .setColor(e.target.value)
              .run()
          }}
          className="h-5 w-5 cursor-pointer rounded overflow-hidden border-0 bg-transparent"
        />
      </div>

      <div className="flex-1" />

      <ToolbarButton
        onClick={(e: any) => {
          e.preventDefault()
          editor.chain().focus().undo().run()
        }}
        title="Undo"
      >
        <Undo className="h-5 w-5" />
      </ToolbarButton>

      <ToolbarButton
        onClick={(e: any) => {
          e.preventDefault()
          editor.chain().focus().redo().run()
        }}
        title="Redo"
      >
        <Redo className="h-5 w-5" />
      </ToolbarButton>

      <div className="w-px h-5 bg-zinc-300 dark:bg-zinc-700 mx-1" />

      <ToolbarButton
        onClick={(e: any) => {
          e.preventDefault()
          onToggleExpand()
        }}
        title={
          isExpanded ? 'Minimize' : 'Expand'
        }
      >
        {isExpanded ? (
          <Minimize className="h-5 w-5" />
        ) : (
          <Maximize className="h-5 w-5" />
        )}
      </ToolbarButton>
    </div>
  )
}

export const RichTextEditor = ({
  content,
  onChange,
}: RichTextEditorProps) => {
  const [isExpanded, setIsExpanded] =
    useState(false)

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
        class:
          'ProseMirror prose dark:prose-invert prose-sm sm:prose-base max-w-none focus:outline-none p-4 text-zinc-900 dark:text-zinc-100',
      },
    },
  })

  const editorBox = (
    <div
      className={cn(
        'bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden flex flex-col shadow-sm',
        isExpanded
          ? 'w-full h-full'
          : 'h-[500px]'
      )}
    >
      {/* Fixed Toolbar */}
      <div
        className="
          sticky
          top-0
          z-30
          shrink-0
          border-b
          border-zinc-200
          dark:border-zinc-800
          p-2
          bg-white/95
          dark:bg-zinc-950/95
          backdrop-blur
        "
      >
        <MenuBar
          editor={editor}
          isExpanded={isExpanded}
          onToggleExpand={() =>
            setIsExpanded(!isExpanded)
          }
        />
      </div>

      {/* Scrollable Editor */}
      <div className="flex-1 overflow-y-auto">
        <EditorContent editor={editor} />
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            .ProseMirror {
              min-height: 100%;
            }

            .ProseMirror:focus {
              outline: none;
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
              padding: 0.75rem 1rem;
              border-radius: 0.5rem;
              overflow-x: auto;
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

            .ProseMirror h1 {
              font-size: 1.875rem;
              font-weight: 700;
              margin-top: 2rem;
              margin-bottom: 1rem;
            }

            .ProseMirror h2 {
              font-size: 1.5rem;
              font-weight: 600;
              margin-top: 1.5rem;
              margin-bottom: 0.75rem;
            }

            .ProseMirror h3 {
              font-size: 1.25rem;
              font-weight: 600;
              margin-top: 1.25rem;
              margin-bottom: 0.5rem;
            }

            .ProseMirror p {
              margin-top: 0.75rem;
              margin-bottom: 0.75rem;
            }
          `,
        }}
      />
    </div>
  )

  if (isExpanded) {
    return (
      <>
        {/* Placeholder */}
        <div className="w-full h-[500px] border border-dashed border-zinc-300 dark:border-zinc-800 rounded-2xl bg-zinc-50 dark:bg-zinc-900/30 flex items-center justify-center text-zinc-700 dark:text-zinc-300 text-sm">
          Editor is open in expanded view...
        </div>

        {/* Modal */}
        <div className="fixed inset-0 z-50 bg-zinc-900/40 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
          {/* Popup */}
          <div
            className="
              w-full
              max-w-6xl
              h-full
              max-h-[90vh]
              overflow-hidden
              rounded-2xl
              flex
            "
          >
            {editorBox}
          </div>
        </div>
      </>
    )
  }

  return editorBox
}

export default RichTextEditor