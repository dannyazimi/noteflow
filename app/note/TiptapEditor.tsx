"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

type Props = {
  storageKey: string;
};

export default function TiptapEditor({ storageKey }: Props) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit],
    content: "<p>Start typing...</p>",
    editorProps: {
      attributes: {
        style:
          "min-height:150px; padding:12px; border:1px solid #ccc; border-radius:8px; outline:none;",
      },
    },
  });

  // Load saved content once
  useEffect(() => {
    if (!editor) return;
    const saved = localStorage.getItem(storageKey);
    if (!saved) return;

    try {
      editor.commands.setContent(JSON.parse(saved));
    } catch {
      // If something is malformed, ignore and keep default content
    }
  }, [editor, storageKey]);

  // Save whenever the editor updates
  useEffect(() => {
    if (!editor) return;

    const save = () => {
      const json = editor.getJSON();
      localStorage.setItem(storageKey, JSON.stringify(json));
    };

    editor.on("update", save);
    return () => {
      editor.off("update", save);
    };
  }, [editor, storageKey]);

  if (!editor) return null;

  return (
    <div style={{ display: "grid", gap: 8 }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          style={{ padding: "6px 10px", border: "1px solid #ccc", borderRadius: 8, background: "white" }}
        >
          Bold
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          style={{ padding: "6px 10px", border: "1px solid #ccc", borderRadius: 8, background: "white" }}
        >
          Italic
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          style={{ padding: "6px 10px", border: "1px solid #ccc", borderRadius: 8, background: "white" }}
        >
          Bullets
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          style={{ padding: "6px 10px", border: "1px solid #ccc", borderRadius: 8, background: "white" }}
        >
          H2
        </button>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}