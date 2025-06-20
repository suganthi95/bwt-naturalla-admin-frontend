
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Button } from './button'
import { Bold, Code2, CornerDownLeft, Italic, ListOrdered, Minus, Redo2, Strikethrough, Undo2 } from 'lucide-react'

const MenuBar = ({ editor }: any) => {


  if (!editor) {
    return null
  }

  return (
  
      <div className="flex flex-wrap gap-2">
        <Button
            type='button'
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={
                !editor.can()
                .chain()
                .focus()
                .toggleBold()
                .run()
            }
            variant={editor.isActive('bold') ? "default" : "outline"}
            size="icon"
        >
          <Bold className="w-4 h-4" />
        </Button>
        <Button
            type='button'
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={
                !editor.can()
                .chain()
                .focus()
                .toggleItalic()
                .run()
            }
            variant={editor.isActive('italic') ? "default" : "outline"}
            size="icon"
        >
          <Italic className="w-4 h-4" />
        </Button>
        <Button
            type='button'
            onClick={() => editor.chain().focus().toggleStrike().run()}
            disabled={
                !editor.can()
                .chain()
                .focus()
                .toggleStrike()
                .run()
            }
            variant={editor.isActive('strike') ? "default" : "outline"}
            size="icon"
        >
          <Strikethrough className="w-4 h-4" />
        </Button>
        <Button
            type='button'
            onClick={() => editor.chain().focus().toggleCode().run()}
            disabled={
                !editor.can()
                .chain()
                .focus()
                .toggleCode()
                .run()
            }
            variant={editor.isActive('code') ? "default" : "outline"}
            size="icon"
        >
          <Code2 className="w-4 h-4" />
        </Button>
        {/* <Button type='button' onClick={() => editor.chain().focus().unsetAllMarks().run()}>
          <Trash2 className="w-4 h-4 mr-1" /> Clear Marks
        </Button>
        <Button type='button' onClick={() => editor.chain().focus().clearNodes().run()}>
           <Trash2 className="w-4 h-4 mr-1" /> Clear Nodes
        </Button> */}
        {/* <Button
            type='button'
            onClick={() => editor.chain().focus().setParagraph().run()}
            variant={editor.isActive('paragraph') ? "default" : "outline"}
            size="icon"
        >
          P
        </Button>
        <Button
            type='button'
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            variant={editor.isActive('heading', { level: 1 }) ? "default" : "outline"}
            size="icon"
        >
          H1
        </Button>
        <Button
            type='button'
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            variant={editor.isActive('heading', { level: 2 }) ? "default" : "outline"}
            size="icon"
        >
          H2
        </Button>
        <Button
            type='button'
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            variant={editor.isActive('heading', { level: 3 }) ? "default" : "outline"}
            size="icon"
        >
          H3
        </Button>
        <Button
            type='button'
            onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
            variant={editor.isActive('heading', { level: 4 }) ? "default" : "outline"}
            size="icon"
        >
          H4
        </Button>
        <Button
            type='button'
            onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
            variant={editor.isActive('heading', { level: 5 }) ? "default" : "outline"}
            size="icon"
        >
          H5
        </Button>
        <Button
            type='button'
            onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
            variant={editor.isActive('heading', { level: 6 }) ? "default" : "outline"}
            size="icon"
        >
          H6
        </Button>
        <Button
            type='button'
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            variant={editor.isActive('bulletList') ? "default" : "outline"}
            size="icon"
        >
          <List className="w-4 h-4" />
        </Button> */}
        <Button
            type='button'
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            variant={editor.isActive('orderedList') ? "default" : "outline"}
            size="icon"
        >
          <ListOrdered className="w-4 h-4" />
        </Button>
        {/* <Button
            type='button'
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={editor.isActive('codeBlock') ? 'is-active' : ''}
        >
          Code block
        </Button>
        <Button
            type='button'
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={editor.isActive('blockquote') ? 'is-active' : ''}
            size="icon"
        >
          <Blockquote className="w-4 h-4" />
        </Button> */}
        <Button type='button' onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          <Minus className="w-4 h-4" />
        </Button>
        <Button type='button' onClick={() => editor.chain().focus().setHardBreak().run()}>
          <CornerDownLeft className="w-4 h-4" />
        </Button>
        <Button
            type='button'
            variant="outline"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={
                !editor.can()
                .chain()
                .focus()
                .undo()
                .run()
            }
            size="icon"
        >
          <Undo2 className="w-4 h-4" />
        </Button>
        <Button
            type='button'
            variant="outline"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={
                !editor.can()
                .chain()
                .focus()
                .redo()
                .run()
            }
            size="icon"
        >
          <Redo2 className="w-4 h-4" />
        </Button>
        {/* <Button
            type='button'
            onClick={() => editor.chain().focus().setColor('#958DF1').run()}
            variant={editor.isActive('textStyle', { color: '#958DF1' }) ? "default" : "outline"}
            size="icon"
        >
            <Paintbrush2 className="w-4 h-4" />
        </Button> */}
      </div>
  )
}

// const extensions = [
//   Color.configure({ types: [TextStyle.name, ListItem.name] }),
//   TextStyle.configure({ types: [ListItem.name] }),
//   StarterKit.configure({
//     bulletList: {
//       keepMarks: true,
//       keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
//     },
//     orderedList: {
//       keepMarks: true,
//       keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
//     },
//   }),
// ]

// const content = `
//     <h2>
//     Hi there,
//     </h2>
//     <p>
//     this is a <em>basic</em> example of <strong>Tiptap</strong>. Sure, there are all kind of basic text styles you’d probably expect from a text editor. But wait until you see the lists:
//     </p>
//     <ul>
//     <li>
//         That’s a bullet list with one …
//     </li>
//     <li>
//         … or two list items.
//     </li>
//     </ul>
//     <p>
//     Isn’t that great? And all of that is editable. But wait, there’s more. Let’s try a code block:
//     </p>
//     <pre><code class="language-css">body {
//     display: none;
//     }</code></pre>
//     <p>
//     I know, I know, this is impressive. It’s only the tip of the iceberg though. Give it a try and click a little bit around. Don’t forget to check the other examples too.
//     </p>
//     <blockquote>
//     Wow, that’s amazing. Good work, boy! 👏
//     <br />
//     — Mom
//     </blockquote>
// `

export default function TipTap({ content }: { content: string }) {

    const editor = useEditor({
        extensions: [
            StarterKit,
        ],
        content,
        editorProps: {
            attributes: {
                spellcheck: 'false',
            }
        },
    })

  return (
    <div className='p-4 border rounded-lg shadow-sm'>
      <MenuBar editor={editor} />
      <hr className='my-3' />
      <EditorContent editor={editor} />
    </div>
  )
}
