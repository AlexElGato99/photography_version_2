"use client";

import { useEffect, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Link2,
  Link2Off,
  CornerDownLeft,
  Heading2,
  Heading3,
  Minus,
} from "lucide-react";

interface RichTextEditorProps {
  label: string;
  value: string; // HTML string
  onChange: (html: string) => void;
  help?: string;
  className?: string;
}

export function RichTextEditor({
  label,
  value,
  onChange,
  help,
  className = "",
}: RichTextEditorProps) {
  const initialised = useRef(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // We want br to work via Shift+Enter
        hardBreak: false,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "cn-rte-link" },
      }),
    ],
    content: value ?? "",
    editorProps: {
      attributes: {
        class: "cn-rte-body",
        "aria-multiline": "true",
        role: "textbox",
      },
    },
    onUpdate({ editor }) {
      // Convert back to HTML — preserve <em>, <strong>, <br>, <a>, etc.
      onChange(editor.getHTML());
    },
  });

  // Sync external value changes (e.g. form reset)
  useEffect(() => {
    if (!editor) return;
    if (!initialised.current) { initialised.current = true; return; }
    if (editor.getHTML() !== value) {
      editor.commands.setContent(value ?? "", { emitUpdate: false });
    }
  }, [value, editor]);

  const addLink = () => {
    const url = window.prompt("URL", editor?.getAttributes("link").href ?? "");
    if (url === null) return;
    if (url === "") {
      editor?.chain().focus().unsetLink().run();
    } else {
      editor?.chain().focus().setLink({ href: url }).run();
    }
  };

  if (!editor) return null;

  return (
    <div className={`block space-y-1.5 ${className}`}>
      {/* Label */}
      <span className="text-xs font-medium text-[var(--text-secondary)]">
        {label}
      </span>

      {/* Editor wrapper */}
      <div className="cn-rte-wrap">
        {/* Toolbar */}
        <div className="cn-rte-toolbar">
          <ToolBtn
            title="Bold"
            active={editor.isActive("bold")}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <Bold size={13} />
          </ToolBtn>
          <ToolBtn
            title="Italic / Emphasis"
            active={editor.isActive("italic")}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <Italic size={13} />
          </ToolBtn>

          <Sep />

          <ToolBtn
            title="Heading 2"
            active={editor.isActive("heading", { level: 2 })}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
          >
            <Heading2 size={13} />
          </ToolBtn>
          <ToolBtn
            title="Heading 3"
            active={editor.isActive("heading", { level: 3 })}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
          >
            <Heading3 size={13} />
          </ToolBtn>

          <Sep />

          <ToolBtn
            title="Bullet list"
            active={editor.isActive("bulletList")}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <List size={13} />
          </ToolBtn>
          <ToolBtn
            title="Ordered list"
            active={editor.isActive("orderedList")}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <ListOrdered size={13} />
          </ToolBtn>

          <Sep />

          <ToolBtn
            title="Line break (Shift+Enter)"
            active={false}
            onClick={() => editor.chain().focus().setHardBreak().run()}
          >
            <CornerDownLeft size={13} />
          </ToolBtn>
          <ToolBtn
            title="Divider"
            active={false}
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
          >
            <Minus size={13} />
          </ToolBtn>

          <Sep />

          <ToolBtn
            title={editor.isActive("link") ? "Edit link" : "Add link"}
            active={editor.isActive("link")}
            onClick={addLink}
          >
            <Link2 size={13} />
          </ToolBtn>
          {editor.isActive("link") && (
            <ToolBtn
              title="Remove link"
              active={false}
              onClick={() => editor.chain().focus().unsetLink().run()}
            >
              <Link2Off size={13} />
            </ToolBtn>
          )}
        </div>

        {/* Editable area */}
        <EditorContent editor={editor} />
      </div>

      {help && (
        <span className="block text-[11px] text-[var(--text-muted)]">{help}</span>
      )}
    </div>
  );
}

function ToolBtn({
  title,
  active,
  onClick,
  children,
}: {
  title: string;
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onMouseDown={(e) => {
        e.preventDefault(); // prevent editor blur
        onClick();
      }}
      className={`cn-rte-btn${active ? " active" : ""}`}
    >
      {children}
    </button>
  );
}

function Sep() {
  return <span className="cn-rte-sep" />;
}
